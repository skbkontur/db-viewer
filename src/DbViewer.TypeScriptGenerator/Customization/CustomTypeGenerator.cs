using System;
using System.Linq;
using System.Reflection;
using System.Text.RegularExpressions;

using SkbKontur.TypeScript.ContractGenerator;
using SkbKontur.TypeScript.ContractGenerator.CodeDom;
using SkbKontur.TypeScript.ContractGenerator.Extensions;
using SkbKontur.TypeScript.ContractGenerator.TypeBuilders;

namespace SkbKontur.DbViewer.TypeScriptGenerator.Customization
{
    public class CustomTypeGenerator : ICustomTypeGenerator
    {
        public string GetTypeLocation(Type type)
        {
            var typeName = GetTypeName(type);
            if (type == typeof(DbViewerControllerImpl))
            {
                return "DBViewerApi";
            }

            const string dbViewerNamespace = "Kontur.DBViewer.Core.VNext.";
            if (type.FullName != null && type.FullName.StartsWith(dbViewerNamespace))
            {
                var name = type.FullName.Replace(dbViewerNamespace, "").Replace(".", "/");
                return new Regex("`.*$").Replace(name, "");
            }

            return type.IsGenericType ? new Regex("`.*$").Replace(typeName, "") : typeName;
        }

        public ITypeBuildingContext ResolveType(string initialUnitPath, Type type, ITypeScriptUnitFactory unitFactory)
        {
            if (type.IsAbstract)
            {
                var targetUnit = unitFactory.GetOrCreateTypeUnit(initialUnitPath);
                return new AbstractTypeBuildingContext(targetUnit, type);
            }

            if (InternalApiTypeBuildingContext.Accept(type))
            {
                var targetUnit = unitFactory.GetOrCreateTypeUnit(initialUnitPath);
                return new InternalApiTypeBuildingContext(targetUnit, type);
            }

            if (DictionaryTypeBuildingContext.Accept(type))
            {
                return new DictionaryTypeBuildingContext(type);
            }

            if (ListTypeBuildingContext.Accept(type))
            {
                return new ListTypeBuildingContext(type);
            }

            if (type == typeof(Guid))
            {
                return TypeBuilding.RedirectToType("Guid", @".\dataTypes\Guid", typeof(Guid));
            }

            if (type == typeof(DateTime))
            {
                return TypeBuilding.RedirectToType("DateTime", @".\dataTypes\DateTime", typeof(DateTime));
            }

            if (type == typeof(DateTimeOffset))
            {
                return TypeBuilding.RedirectToType("DateTime", @".\dataTypes\DateTime", typeof(DateTimeOffset));
            }

            if (type == typeof(ApiResponse))
            {
                return TypeBuilding.RedirectToType("ApiResponse", @".\dataTypes\ApiResponse", typeof(ApiResponse));
            }

            if (type == typeof(TimeSpan))
            {
                return TypeBuilding.RedirectToType("TimeSpan", @".\dataTypes\TimeSpan", typeof(TimeSpan));
            }

            return null;
        }

        public TypeScriptTypeMemberDeclaration ResolveProperty(TypeScriptUnit unit, ITypeGenerator typeGenerator,
                                                               Type type,
                                                               PropertyInfo property)
        {
            if (property.PropertyType.IsEnum && !property.CanWrite)
            {
                return new TypeScriptTypeMemberDeclaration
                    {
                        Name = property.Name.ToLowerCamelCase(),
                        Optional = false,
                        Type = new TypeScriptEnumValueType(
                            typeGenerator.BuildAndImportType(unit, property, property.PropertyType), property.GetMethod
                                                                                                             .Invoke(
                                                                                                                 CreateDefaultNotNullObject(type),
                                                                                                                 null
                                                                                                             ).ToString()
                        ),
                    };
            }

            return null;
        }

        private object CreateDefaultNotNullObject(Type type)
        {
            var ctor = type.GetConstructors().FirstOrDefault();
            if (ctor == null)
                return Activator.CreateInstance(type);
            var parameters = ctor.GetParameters();
            return Activator.CreateInstance(
                type,
                parameters.Select(x => GetDefault(x.ParameterType)).ToArray()
            );
        }

        private static string GetTypeName(Type type)
        {
            return type.Name;
        }

        private static object GetDefault(Type type)
        {
            if (type.IsValueType)
            {
                return Activator.CreateInstance(type);
            }

            return null;
        }
    }
}