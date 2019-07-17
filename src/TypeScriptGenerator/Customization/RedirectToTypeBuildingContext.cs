using System;
using SkbKontur.TypeScript.ContractGenerator;
using SkbKontur.TypeScript.ContractGenerator.CodeDom;
using SkbKontur.TypeScript.ContractGenerator.TypeBuilders;

namespace Kontur.DBViewer.TypeScriptGenerator.Customization
{
    public class RedirectToTypeBuildingContext : ITypeBuildingContext
    {
        public RedirectToTypeBuildingContext(string typeName, string path, Type type)
        {
            this.typeName = typeName;
            this.path = path;
            this.type = type;
        }

        public bool IsDefinitionBuilt => true;

        public void Initialize(ITypeGenerator typeGenerator)
        {
        }

        public void BuildDefinition(ITypeGenerator typeGenerator)
        {
        }

        public TypeScriptType ReferenceFrom(TypeScriptUnit targetUnit, ITypeGenerator typeGenerator)
        {
            return targetUnit.AddTypeImport(type, new TypeScriptInterfaceDeclaration {Name = typeName}, new TypeScriptUnit {Path = path});
        }

        private readonly string typeName;
        private readonly string path;
        private readonly Type type;
    }
}