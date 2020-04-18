using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using System.Web.Http;

using SkbKontur.DbViewer.TestApi.Controllers;
using SkbKontur.TypeScript.ContractGenerator;
using SkbKontur.TypeScript.ContractGenerator.Abstractions;
using SkbKontur.TypeScript.ContractGenerator.CodeDom;
using SkbKontur.TypeScript.ContractGenerator.Extensions;
using SkbKontur.TypeScript.ContractGenerator.TypeBuilders;

using TypeInfo = SkbKontur.TypeScript.ContractGenerator.Internals.TypeInfo;

namespace SkbKontur.DbViewer.TestApi.TypeScriptConfiguration
{
    public class InternalApiTypeBuildingContext : TypeBuildingContext
    {
        public InternalApiTypeBuildingContext(TypeScriptUnit unit, ITypeInfo type)
            : base(unit, type)
        {
        }

        public static bool Accept(ITypeInfo type)
        {
            return TypeInfo.From<DbViewerApiController>().IsAssignableFrom(type);
        }

        public static string GetApiName(ITypeInfo apiType)
        {
            return apiType.Name.Replace("Controller", "");
        }

        public override void Initialize(ITypeGenerator typeGenerator)
        {
            Declaration = GenerateInternalApiController(Unit, Type, (x, y) => typeGenerator.BuildAndImportType(Unit, x, y));
            base.Initialize(typeGenerator);
        }

        private TypeScriptTypeDeclaration GenerateInternalApiController(TypeScriptUnit targetUnit, ITypeInfo type,
                                                                        Func<IAttributeProvider, ITypeInfo, TypeScriptType> buildAndImportType)
        {
            var baseApiClassName = "ApiBase";
            var apiName = GetApiName(type);
            var interfaceName = "I" + apiName;
            var typeScriptClassDefinition = new TypeScriptClassDefinition
                {
                    BaseClass = new TypeScriptTypeReference(baseApiClassName),
                    ImplementedInterfaces = new TypeScriptType[] {new TypeScriptTypeReference(interfaceName)}
                };
            var methodInfos = type.GetMethods(BindingFlags.Instance | BindingFlags.Public)
                                  .Where(x => x.DeclaringType.Equals(type))
                                  .ToArray();

            typeScriptClassDefinition.Members.AddRange(methodInfos.SelectMany(x => BuildApiImplMember(x, buildAndImportType)));

            targetUnit.Body.Add(new TypeScriptExportStatement
                {
                    Declaration = new TypeScriptClassDeclaration
                        {
                            Name = apiName,
                            Defintion = typeScriptClassDefinition
                        }
                });
            var definition = new TypeScriptInterfaceDefinition();
            definition.Members.AddRange(methodInfos.SelectMany(x => BuildApiInterfaceMember(x, buildAndImportType)));
            targetUnit.AddDefaultSymbolImport(baseApiClassName, $"../apiBase/{baseApiClassName}");

            var interfaceDeclaration = new TypeScriptInterfaceDeclaration
                {
                    Name = interfaceName,
                    Definition = definition
                };

            return interfaceDeclaration;
        }

        private IEnumerable<TypeScriptClassMemberDefinition> BuildApiImplMember(IMethodInfo methodInfo, Func<IAttributeProvider, ITypeInfo, TypeScriptType> buildAndImportType)
        {
            var functionDefinition = new TypeScriptFunctionDefinition
                {
                    IsAsync = true,
                    Result = GetMethodResult(methodInfo, buildAndImportType),
                    Body = {CreateCall(methodInfo)}
                };
            functionDefinition.Arguments.AddRange(
                methodInfo.GetParameters().Select(x => new TypeScriptArgumentDeclaration
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

        private static TypeScriptType GetMethodResult(IMethodInfo methodInfo, Func<IAttributeProvider, ITypeInfo, TypeScriptType> buildAndImportType)
        {
            var realType = methodInfo.ReturnType;
            if (realType.IsGenericType && realType.GetGenericTypeDefinition().Equals(TypeInfo.From(typeof(Task<>))))
                realType = realType.GetGenericArguments()[0];
            else if (realType.Equals(TypeInfo.From<Task>()))
                realType = TypeInfo.From(typeof(void));

            return new TypeScriptPromiseOfType(buildAndImportType(methodInfo, realType));
        }

        private static TypeScriptReturnStatement CreateCall(IMethodInfo methodInfo)
        {
            if (methodInfo.GetAttributes(TypeInfo.From<HttpGetAttribute>()).Any())
                return GenerateGetMethodCall(methodInfo);

            if (methodInfo.GetAttributes(TypeInfo.From<HttpPostAttribute>()).Any())
                return GenerateMethodCallWithBody(methodInfo, "post");

            if (methodInfo.GetAttributes(TypeInfo.From<HttpDeleteAttribute>()).Any())
                return GenerateMethodCallWithBody(methodInfo, "delete");

            return new TypeScriptReturnStatement(new TypeScriptConstantExpression("null"));
        }

        private static TypeScriptReturnStatement GenerateGetMethodCall(IMethodInfo methodInfo)
        {
            var routeTemplate = methodInfo.GetAttributes(TypeInfo.From<RouteAttribute>()).Single().GetValue("Template", "");
            return new TypeScriptReturnStatement(
                new TypeScriptMethodCallExpression(
                    new TypeScriptThisReference(),
                    "get",
                    new[]
                        {
                            new TypeScriptTemplateStringLiteral(AppendRoutePrefix(routeTemplate).Replace("{", "${")),
                            GenerateConstructGetParams(methodInfo.GetParameters().ToArray(), routeTemplate)
                        }.Where(x => x != null).ToArray()
                ));
        }

        private static TypeScriptReturnStatement GenerateMethodCallWithBody(IMethodInfo methodInfo, string methodName)
        {
            var routeTemplate = methodInfo.GetAttributes(TypeInfo.From<RouteAttribute>()).Single().GetValue("Template", "");
            return new TypeScriptReturnStatement(
                new TypeScriptMethodCallExpression(
                    new TypeScriptThisReference(),
                    methodName,
                    new TypeScriptTemplateStringLiteral(AppendRoutePrefix(routeTemplate).Replace("{", "${")),
                    GenerateConstructBody(methodInfo.GetParameters().ToArray(), routeTemplate)
                ));
        }

        private static string AppendRoutePrefix(string routeTemplate)
        {
            return routeTemplate;
        }

        private static TypeScriptExpression GenerateConstructBody(IParameterInfo[] parameters, string routeTemplate)
        {
            var bodyParameters = parameters.Where(x => !IsParameterPassedViaUrl(x, routeTemplate)).ToArray();

            if (bodyParameters.Any(x => x.ParameterType.IsArray && x.GetAttributes(TypeInfo.From<FromBodyAttribute>()).Any()))
            {
                if (bodyParameters.Length != 1)
                    throw new Exception("Only one array argument with Body attribute can appears in method signature");

                return new TypeScriptVariableReference(bodyParameters[0].Name);
            }

            var result = new TypeScriptObjectLiteral(
                parameters.Select<IParameterInfo, TypeScriptObjectLiteralInitializer>(parameter =>
                              {
                                  if (parameter.GetAttributes(TypeInfo.From<FromBodyAttribute>()).Any())
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

        private static bool IsParameterPassedViaUrl(IParameterInfo x, string routeTemplate)
        {
            return routeTemplate.Contains("{" + x.Name + "}");
        }

        private static TypeScriptExpression GenerateConstructGetParams(IParameterInfo[] parameters, string routeTemplate)
        {
            var literalProperties = parameters
                                    .Select<IParameterInfo, TypeScriptObjectLiteralInitializer>(parameter =>
                                        {
                                            if (parameter.GetAttributes(TypeInfo.From<FromBodyAttribute>()).Any())
                                                throw new Exception($"Невозможно обработать параметр {parameter.Name}: {parameter.ParameterType.Name} для пути {routeTemplate}");

                                            if (routeTemplate.Contains("{" + parameter.Name + "}"))
                                                return null;

                                            return new TypeScriptObjectLiteralProperty(new TypeScriptStringLiteral(parameter.Name), new TypeScriptVariableReference(parameter.Name));
                                        })
                                    .Where(x => x != null)
                                    .ToArray();
            if (!literalProperties.Any())
                return null;
            var result = new TypeScriptObjectLiteral(literalProperties);
            return result;
        }

        private static IEnumerable<TypeScriptInterfaceFunctionMember> BuildApiInterfaceMember(IMethodInfo methodInfo, Func<IAttributeProvider, ITypeInfo, TypeScriptType> buildAndImportType)
        {
            var result = new TypeScriptInterfaceFunctionMember(methodInfo.Name.ToLowerCamelCase(), GetMethodResult(methodInfo, buildAndImportType));
            result.Arguments.AddRange(
                methodInfo.GetParameters().Select(x => new TypeScriptArgumentDeclaration
                    {
                        Name = x.Name,
                        Type = buildAndImportType(x, x.ParameterType)
                    })
            );
            yield return result;
        }
    }
}