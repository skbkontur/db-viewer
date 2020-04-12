using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

using SkbKontur.DbViewer.Attributes;
using SkbKontur.TypeScript.ContractGenerator;
using SkbKontur.TypeScript.ContractGenerator.CodeDom;
using SkbKontur.TypeScript.ContractGenerator.Extensions;
using SkbKontur.TypeScript.ContractGenerator.TypeBuilders;

namespace SkbKontur.DbViewer.TypeScriptGenerator
{
    public class InternalApiTypeBuildingContext : TypeBuildingContext
    {
        public InternalApiTypeBuildingContext(TypeScriptUnit unit, Type type)
            : base(unit, type)
        {
        }

        public static bool Accept(Type type)
        {
            return typeof(DbViewerApi).IsAssignableFrom(type);
        }

        public override void Initialize(ITypeGenerator typeGenerator)
        {
            Declaration = GenerateInternalApiController(Unit, Type, (x, y) => typeGenerator.BuildAndImportType(Unit, x, y));
            base.Initialize(typeGenerator);
        }

        private TypeScriptTypeDeclaration GenerateInternalApiController(TypeScriptUnit targetUnit, Type type,
                                                                        Func<ICustomAttributeProvider, Type, TypeScriptType> buildAndImportType)
        {
            var baseApiClassName = "ApiBase";
            var apiName = type.Name;
            var interfaceName = "I" + apiName;
            var typeScriptClassDefinition = new TypeScriptClassDefinition
                {
                    BaseClass = new TypeScriptTypeReference(baseApiClassName),
                    ImplementedInterfaces = new TypeScriptType[] {new TypeScriptTypeReference(interfaceName)}
                };
            var methodInfos = type.GetMethods(BindingFlags.Instance | BindingFlags.Public)
                                  .Where(m => !m.IsSpecialName)
                                  .Where(x => x.DeclaringType == type)
                                  .ToArray();

            typeScriptClassDefinition.Members.AddRange(methodInfos.SelectMany(x => BuildApiImplMember(targetUnit, x, buildAndImportType, type)));

            targetUnit.Body.Add(new TypeScriptExportStatement
                {
                    Declaration = new TypeScriptClassDeclaration
                        {
                            Name = apiName,
                            Defintion = typeScriptClassDefinition
                        }
                });
            var definition = new TypeScriptInterfaceDefinition();
            definition.Members.AddRange(methodInfos.SelectMany(x => BuildApiInterfaceMember(targetUnit, x, buildAndImportType)));
            targetUnit.AddDefaultSymbolImport(baseApiClassName, $"../apiBase/{baseApiClassName}");

            var interfaceDeclaration = new TypeScriptInterfaceDeclaration
                {
                    Name = interfaceName,
                    Definition = definition
                };

            return interfaceDeclaration;
        }

        private IEnumerable<TypeScriptClassMemberDefinition> BuildApiImplMember(TypeScriptUnit targetUnit, MethodInfo methodInfo,
                                                                                Func<ICustomAttributeProvider, Type, TypeScriptType> buildAndImportType, Type controllerType)
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
            yield return new TypeScriptClassMemberDefinition
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

            return new TypeScriptPromiseOfType(buildAndImportType(methodInfo, realType));
        }

        private static TypeScriptReturnStatement CreateCall(MethodInfo methodInfo, Type controllerType)
        {
            return CreateInnerCall(methodInfo, controllerType);
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
                    throw new Exception("Only one array argument with Body attribute can appears in method signature");

                return new TypeScriptVariableReference(bodyParameters[0].Name);
            }

            var result = new TypeScriptObjectLiteral(
                parameters
                    .Where(AcceptParameter)
                    .Select<ParameterInfo, TypeScriptObjectLiteralInitializer>(parameter =>
                        {
                            if (parameter.GetCustomAttributes<FromBodyAttribute>().Any())
                                return new TypeScriptObjectLiteralSpread(new TypeScriptVariableReference(parameter.Name));

                            if (IsParameterPassedViaUrl(parameter, routeTemplate))
                            {
                                // do nothing
                                return null;
                            }

                            return new TypeScriptObjectLiteralProperty(new TypeScriptStringLiteral(parameter.Name), new TypeScriptVariableReference(parameter.Name));
                        })
                    .Where(x => x != null)
                    .ToArray()
            );
            return result;
        }

        private static bool IsParameterPassedViaUrl(ParameterInfo x, string routeTemplate)
        {
            return routeTemplate.Contains("{" + x.Name + "}");
        }

        private static TypeScriptExpression GenerateConstructGetParams(ParameterInfo[] parameters, string routeTemplate)
        {
            var literalProperties = parameters
                                    .Where(AcceptParameter)
                                    .Select<ParameterInfo, TypeScriptObjectLiteralInitializer>(parameter =>
                                        {
                                            if (parameter.GetCustomAttributes<FromBodyAttribute>().Any())
                                            {
                                                throw new Exception($"Невозможно обработать параметр {parameter.Name}: {parameter.ParameterType.Name} для пути {routeTemplate}");
                                            }

                                            if (routeTemplate.Contains("{" + parameter.Name + "}"))
                                            {
                                                return null;
                                            }

                                            return new TypeScriptObjectLiteralProperty(new TypeScriptStringLiteral(parameter.Name), new TypeScriptVariableReference(parameter.Name));
                                        })
                                    .Where(x => x != null)
                                    .ToArray();
            if (!literalProperties.Any())
                return null;
            var result = new TypeScriptObjectLiteral(literalProperties);
            return result;
        }

        private IEnumerable<TypeScriptInterfaceFunctionMember> BuildApiInterfaceMember(TypeScriptUnit targetUnit, MethodInfo methodInfo,
                                                                                       Func<ICustomAttributeProvider, Type, TypeScriptType> buildAndImportType)
        {
            var result = new TypeScriptInterfaceFunctionMember(methodInfo.Name.ToLowerCamelCase(), GetMethodResult(targetUnit, methodInfo, buildAndImportType, false));
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