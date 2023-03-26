﻿using System;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Mvc;

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
            Declaration = GenerateInternalApiController(x => typeGenerator.BuildAndImportType(Unit, x));
            base.Initialize(typeGenerator);
        }

        private TypeScriptTypeDeclaration GenerateInternalApiController(Func<ITypeInfo, TypeScriptType> buildAndImportType)
        {
            var baseApiClassName = "ApiBase";
            var apiName = GetApiName(Type);
            var interfaceName = "I" + apiName;
            var typeScriptClassDefinition = new TypeScriptClassDefinition
                {
                    BaseClass = new TypeScriptTypeReference(baseApiClassName),
                    ImplementedInterfaces = new TypeScriptType[] {new TypeScriptTypeReference(interfaceName)}
                };
            var methodInfos = Type.GetMethods(BindingFlags.Instance | BindingFlags.Public | BindingFlags.DeclaredOnly).ToArray();

            typeScriptClassDefinition.Members.AddRange(methodInfos.Select(x => BuildApiImplMember(x, buildAndImportType)));

            Unit.Body.Add(new TypeScriptExportStatement
                {
                    Declaration = new TypeScriptClassDeclaration
                        {
                            Name = apiName,
                            Defintion = typeScriptClassDefinition
                        }
                });
            var definition = new TypeScriptInterfaceDefinition();
            definition.Members.AddRange(methodInfos.Select(x => BuildApiInterfaceMember(x, buildAndImportType)));
            Unit.AddDefaultSymbolImport(baseApiClassName, $"../ApiBase/{baseApiClassName}");

            return new TypeScriptInterfaceDeclaration
                {
                    Name = interfaceName,
                    Definition = definition
                };
        }

        private static TypeScriptClassMemberDefinition BuildApiImplMember(IMethodInfo methodInfo, Func<ITypeInfo, TypeScriptType> buildAndImportType)
        {
            var isUrlMethod = IsUrlMethod(methodInfo);
            var functionDefinition = new TypeScriptFunctionDefinition
                {
                    IsAsync = !isUrlMethod,
                    Result = GetMethodResult(methodInfo, buildAndImportType),
                    Body = {isUrlMethod ? GenerateGetUrlCall(methodInfo) : CreateCall(methodInfo)}
                };
            functionDefinition.Arguments.AddRange(GetArguments(methodInfo, buildAndImportType));
            return new TypeScriptClassMemberDefinition
                {
                    Name = GetMethodName(methodInfo),
                    Definition = functionDefinition
                };
        }

        private static TypeScriptType GetMethodResult(IMethodInfo methodInfo, Func<ITypeInfo, TypeScriptType> buildAndImportType)
        {
            if (IsUrlMethod(methodInfo))
                return new TypeScriptTypeReference("string");
            var returnType = buildAndImportType(methodInfo.ReturnType);
            var trueType = returnType is TypeScriptPromiseOfType promise ? promise.TargetType : returnType;
            return new TypeScriptPromiseOfType(trueType);
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
                            new TypeScriptTemplateStringLiteral(routeTemplate.Replace("{", "${")),
                            GenerateConstructGetParams(methodInfo.GetParameters().ToArray(), routeTemplate)
                        }.Where(x => x != null).ToArray()
                ));
        }

        private static TypeScriptReturnStatement GenerateGetUrlCall(IMethodInfo methodInfo)
        {
            var routeTemplate = methodInfo.GetAttributes(TypeInfo.From<RouteAttribute>()).Single().GetValue("Template", "");
            return new TypeScriptReturnStatement(
                new TypeScriptTemplateStringLiteral("${this.prefix}" + routeTemplate.Replace("{", "${"))
            );
        }

        private static TypeScriptReturnStatement GenerateMethodCallWithBody(IMethodInfo methodInfo, string methodName)
        {
            var routeTemplate = methodInfo.GetAttributes(TypeInfo.From<RouteAttribute>()).Single().GetValue("Template", "");
            return new TypeScriptReturnStatement(
                new TypeScriptMethodCallExpression(
                    new TypeScriptThisReference(),
                    methodName,
                    new TypeScriptTemplateStringLiteral(routeTemplate.Replace("{", "${")),
                    GenerateConstructBody(methodInfo.GetParameters().ToArray(), routeTemplate)
                ));
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

        private static bool IsUrlMethod(IMethodInfo methodInfo)
        {
            return methodInfo.ReturnType.Equals(TypeInfo.From<IActionResult>()) || methodInfo.ReturnType.Equals(TypeInfo.From<Task<IActionResult>>());
        }

        private static string GetMethodName(IMethodInfo methodInfo)
        {
            return IsUrlMethod(methodInfo) ? $"get{methodInfo.Name}Url" : methodInfo.Name.ToLowerCamelCase();
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

        private static TypeScriptInterfaceFunctionMember BuildApiInterfaceMember(IMethodInfo methodInfo, Func<ITypeInfo, TypeScriptType> buildAndImportType)
        {
            var result = new TypeScriptInterfaceFunctionMember(GetMethodName(methodInfo), GetMethodResult(methodInfo, buildAndImportType));
            result.Arguments.AddRange(GetArguments(methodInfo, buildAndImportType));
            return result;
        }

        private static TypeScriptArgumentDeclaration[] GetArguments(IMethodInfo methodInfo, Func<ITypeInfo, TypeScriptType> buildAndImportType)
        {
            var isUrlMethod = IsUrlMethod(methodInfo);
            return methodInfo.GetParameters()
                             .Where(x => !isUrlMethod || !x.ParameterType.GetAttributes(TypeInfo.From<FromFormAttribute>()).Any())
                             .Select(x => new TypeScriptArgumentDeclaration
                                 {
                                     Name = x.Name,
                                     Type = buildAndImportType(x.ParameterType)
                                 })
                             .ToArray();
        }
    }
}