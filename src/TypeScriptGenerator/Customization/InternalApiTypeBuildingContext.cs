using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Kontur.DBViewer.Core;
using Kontur.DBViewer.Core.Attributes;
using Kontur.DBViewer.Core.VNext;
using SkbKontur.TypeScript.ContractGenerator;
using SkbKontur.TypeScript.ContractGenerator.CodeDom;
using SkbKontur.TypeScript.ContractGenerator.Extensions;
using SkbKontur.TypeScript.ContractGenerator.TypeBuilders;

namespace Kontur.DBViewer.TypeScriptGenerator.Customization
{
    public class InternalApiTypeBuildingContext : TypeBuildingContext
    {
        public InternalApiTypeBuildingContext(TypeScriptUnit unit, Type type)
            : base(unit, type)
        {
        }

        public static bool Accept(Type type)
        {
            return typeof(DBViewerControllerImpl).IsAssignableFrom(type) ||
                   typeof(BusinessObjectsApi).IsAssignableFrom(type);
        }

        public override void Initialize(ITypeGenerator typeGenerator)
        {
            Declaration =
                GenerateInternalApiController(Unit, Type, (x, y) => typeGenerator.BuildAndImportType(Unit, x, y));
            base.Initialize(typeGenerator);
        }

        private TypeScriptTypeDeclaration GenerateInternalApiController(TypeScriptUnit targetUnit, Type type,
            Func<ICustomAttributeProvider, Type, TypeScriptType> buildAndImportType)
        {
            var baseApiClassName = GetBaseApiClassName(type);
            var apiName = DoCreateApiName(type);
            var TypeScriptClassDefinition = new TypeScriptClassDefinition
            {
                BaseClass = new TypeScriptTypeReference(baseApiClassName),
            };
            var methodInfos = type
                .GetMethods(BindingFlags.Instance | BindingFlags.Public)
                .Where(m => !m.IsSpecialName)
                .Where(x => x.DeclaringType == type)
                .ToArray();

            TypeScriptClassDefinition.Members.AddRange(
                methodInfos
                    .SelectMany(x => BuildApiImplMember(targetUnit, x, buildAndImportType, type)));

            targetUnit.Body.Add(new TypeScriptExportStatement
            {
                Declaration = new TypeScriptClassDeclaration
                {
                    Name = apiName + "Impl",
                    Defintion = TypeScriptClassDefinition
                }
            });
            var definition = new TypeScriptInterfaceDefinition();
            definition.Members.AddRange(methodInfos
                .SelectMany(x => BuildApiInterfaceMember(targetUnit, x, buildAndImportType)));
            targetUnit.AddDefaultSymbolImport(baseApiClassName, $"../apiBase/{baseApiClassName}");

            var interfaceDeclaration = new TypeScriptInterfaceDeclaration
            {
                Name = "I" + apiName,
                Definition = definition
            };

            return interfaceDeclaration;
        }

        private string GetBaseApiClassName(Type controller)
        {
            return "ApiBase";
        }

        private static string DoCreateApiName(Type type)
        {
            return new Regex("ControllerImpl").Replace(type.Name, "Api");
        }

        private IEnumerable<TypeScriptClassMemberDefinition> BuildApiImplMember(TypeScriptUnit targetUnit,
            MethodInfo methodInfo, Func<ICustomAttributeProvider, Type, TypeScriptType> buildAndImportType,
            Type controllerType)
        {
            var functionDefinition = new TypeScriptFunctionDefinition
            {
                IsAsync = true,
                Result = GetMethodResult(targetUnit, methodInfo, buildAndImportType),
                Body = {CreateCall(methodInfo, controllerType)}
            };
            functionDefinition.Arguments.AddRange(
                methodInfo.GetParameters().Where(AcceptParameter).Select(x => new TypeScriptArgumentDeclaration
                {
                    Name = x.Name,
                    Type = buildAndImportType(x, x.ParameterType)
                })
            );
            yield return
                new TypeScriptClassMemberDefinition
                {
                    Name = methodInfo.Name.ToLowerCamelCase(),
                    Definition = functionDefinition
                };
        }

        private static TypeScriptType GetMethodResult(TypeScriptUnit targetUnit, MethodInfo methodInfo,
            Func<ICustomAttributeProvider, Type, TypeScriptType> buildAndImportType, bool declareErrorResultType = true)
        {
            var realType = methodInfo.ReturnType;
            if (realType.IsGenericType && realType.GetGenericTypeDefinition() == typeof(Task<>))
                realType = realType.GetGenericArguments()[0];
            else if (realType == typeof(Task))
                realType = typeof(void);
            TypeScriptType methodResult;
            methodResult = new TypeScriptPromiseOfType(buildAndImportType(methodInfo, realType));

            return methodResult;
        }

        private static TypeScriptReturnStatement CreateCall(MethodInfo methodInfo, Type controllerType)
        {
            var TypeScriptReturnStatement = CreateInnerCall(methodInfo, controllerType);
            return TypeScriptReturnStatement;
        }

        private static TypeScriptReturnStatement CreateInnerCall(MethodInfo methodInfo, Type controllerType)
        {
            if (methodInfo.GetCustomAttribute<HttpGetAttribute>() != null)
            {
                return GenerateGetMethodCall(methodInfo, controllerType);
            }

            if (methodInfo.GetCustomAttribute<HttpPostAttribute>() != null)
            {
                return GenerateMethodCallWithBody(methodInfo, "post", controllerType);
            }

            if (methodInfo.GetCustomAttribute<HttpDeleteAttribute>() != null)
            {
                return GenerateMethodCallWithBody(methodInfo, "delete", controllerType);
            }

            return new TypeScriptReturnStatement(new TypeScriptConstantExpression("null"));
        }

        private static TypeScriptReturnStatement GenerateGetMethodCall(MethodInfo methodInfo, Type controllerType)
        {
            var routeTemplate = methodInfo.GetCustomAttribute<RouteAttribute>()?.Template;
            return new TypeScriptReturnStatement(
                new TypeScriptMethodCallExpression(
                    new TypeScriptThisReference(),
                    "get",
                    new[]
                    {
                        new TypeScriptTemplateStringLiteral(AppendRoutePrefix(routeTemplate).Replace("{", "${")),
                        GenerateConstructGetParams(
                            methodInfo
                                .GetParameters()
                                .Where(AcceptParameter)
                                .ToArray(), routeTemplate)
                    }.Where(x => x != null).ToArray()
                ));
        }

        private static TypeScriptReturnStatement GenerateMethodCallWithBody(MethodInfo methodInfo, string methodName,
            Type controllerType)
        {
            var routeTemplate = methodInfo.GetCustomAttribute<RouteAttribute>()?.Template;
            return new TypeScriptReturnStatement(
                new TypeScriptMethodCallExpression(
                    new TypeScriptThisReference(),
                    methodName,
                    new TypeScriptTemplateStringLiteral(AppendRoutePrefix(routeTemplate).Replace("{", "${")),
                    GenerateConstructBody(methodInfo.GetParameters().Where(AcceptParameter).ToArray(), routeTemplate)
                ));
        }

        private static string AppendRoutePrefix(string routeTemplate)
        {
            return routeTemplate;
        }

        private static bool AcceptParameter(ParameterInfo parameterInfo)
        {
            var parameter = parameterInfo;
            if (parameter.GetCustomAttributes<FromBodyAttribute>().Any())
                return true;
            return !autoInjectedTypes.Contains(parameter.ParameterType);
        }

        private static TypeScriptExpression GenerateConstructBody(ParameterInfo[] parameters, string routeTemplate)
        {
            var bodyParameters = parameters.Where(x => !IsParameterPassedViaUrl(x, routeTemplate)).ToArray();

            if (bodyParameters.Any(x => x.ParameterType.IsArray && x.GetCustomAttribute<FromBodyAttribute>() != null))
            {
                if (bodyParameters.Length != 1)
                {
                    throw new Exception("Only one array argument with Body attribute can appears in method signature");
                }

                return new TypeScriptVariableReference(bodyParameters[0].Name);
            }

            var result = new TypeScriptObjectLiteral(
                parameters
                    .Where(AcceptParameter)
                    .Select<ParameterInfo, TypeScriptObjectLiteralInitializer>(parameter =>
                    {
                        if (parameter.GetCustomAttributes<FromBodyAttribute>().Any())
                        {
                            return new TypeScriptObjectLiteralSpread(new TypeScriptVariableReference(parameter.Name));
                        }

                        if (IsParameterPassedViaUrl(parameter, routeTemplate))
                        {
                            // do nothing
                            return null;
                        }

                        return new TypeScriptObjectLiteralProperty
                        {
                            Name = new TypeScriptStringLiteral(parameter.Name),
                            Value = new TypeScriptVariableReference(parameter.Name),
                        };
                    })
                    .Where(x => x != null)
            );
            return result;
        }

        private static bool IsParameterPassedViaUrl(ParameterInfo x, string routeTemplate)
        {
            return routeTemplate.Contains("{" + x.Name + "}");
        }

        private static TypeScriptExpression GenerateConstructGetParams(ParameterInfo[] parameters, string routeTemplate)
        {
            var literalProperies = parameters
                .Where(AcceptParameter)
                .Select<ParameterInfo, TypeScriptObjectLiteralInitializer>(parameter =>
                {
                    if (parameter.GetCustomAttributes<FromBodyAttribute>().Any())
                    {
                        throw new Exception(string.Format("Невозможно обработать параметр {0}: {1} для пути {2}",
                            parameter.Name, parameter.ParameterType.Name, routeTemplate));
                    }

                    if (routeTemplate.Contains("{" + parameter.Name + "}"))
                    {
                        return null;
                    }

                    return new TypeScriptObjectLiteralProperty
                    {
                        Name = new TypeScriptStringLiteral(parameter.Name),
                        Value = new TypeScriptVariableReference(parameter.Name),
                    };
                })
                .Where(x => x != null)
                .ToArray();
            if (!literalProperies.Any())
                return null;
            var result = new TypeScriptObjectLiteral(literalProperies);
            return result;
        }

        private IEnumerable<TypeScriptInterfaceFunctionMember> BuildApiInterfaceMember(TypeScriptUnit targetUnit,
            MethodInfo methodInfo, Func<ICustomAttributeProvider, Type, TypeScriptType> buildAndImportType)
        {
            var result = new TypeScriptInterfaceFunctionMember
            {
                Name = methodInfo.Name.ToLowerCamelCase(),
                Result = GetMethodResult(targetUnit, methodInfo, buildAndImportType, false)
            };
            result.Arguments.AddRange(
                methodInfo.GetParameters().Where(AcceptParameter).Select(x => new TypeScriptArgumentDeclaration
                {
                    Name = x.Name,
                    Type = buildAndImportType(x, x.ParameterType)
                })
            );
            yield return result;
        }

        private static readonly Type[] autoInjectedTypes =
        {
        };
    }
}