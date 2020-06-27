using System.Text.RegularExpressions;

using SkbKontur.TypeScript.ContractGenerator;
using SkbKontur.TypeScript.ContractGenerator.Abstractions;
using SkbKontur.TypeScript.ContractGenerator.CodeDom;
using SkbKontur.TypeScript.ContractGenerator.TypeBuilders;

namespace SkbKontur.DbViewer.TestApi.TypeScriptConfiguration
{
    public class DbViewerCustomTypeGenerator : ICustomTypeGenerator
    {
        public string GetTypeLocation(ITypeInfo type)
        {
            if (InternalApiTypeBuildingContext.Accept(type))
                return InternalApiTypeBuildingContext.GetApiName(type);

            const string dbViewerNamespace = "SkbKontur.DbViewer.";
            if (type.FullName != null && type.FullName.StartsWith(dbViewerNamespace))
            {
                var name = type.FullName.Replace(dbViewerNamespace, "").Replace(".", "/");
                return new Regex("`.*$").Replace(name, "");
            }

            return type.IsGenericType ? new Regex("`.*$").Replace(type.Name, "") : type.Name;
        }

        public ITypeBuildingContext ResolveType(string initialUnitPath, ITypeGenerator typeGenerator, ITypeInfo type, ITypeScriptUnitFactory unitFactory)
        {
            if (InternalApiTypeBuildingContext.Accept(type))
                return new InternalApiTypeBuildingContext(unitFactory.GetOrCreateTypeUnit(initialUnitPath), type);

            return null;
        }

        public TypeScriptTypeMemberDeclaration ResolveProperty(TypeScriptUnit unit, ITypeGenerator typeGenerator, ITypeInfo type, IPropertyInfo property)
        {
            return null;
        }
    }
}