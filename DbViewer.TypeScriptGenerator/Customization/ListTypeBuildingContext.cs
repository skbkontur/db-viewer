using System;
using System.Collections.Generic;

using SkbKontur.TypeScript.ContractGenerator;
using SkbKontur.TypeScript.ContractGenerator.CodeDom;
using SkbKontur.TypeScript.ContractGenerator.TypeBuilders;

namespace SkbKontur.DbViewer.TypeScriptGenerator.Customization
{
    public class ListTypeBuildingContext : ITypeBuildingContext
    {
        public ListTypeBuildingContext(Type listType)
        {
            itemType = listType.GetGenericArguments()[0];
        }

        public static bool Accept(Type type)
        {
            return type.IsGenericType && type.GetGenericTypeDefinition() == typeof(List<>);
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
            var itemTypeScript = typeGenerator.ResolveType(itemType).ReferenceFrom(targetUnit, typeGenerator);
            return new TypeScriptArrayType(itemTypeScript);
        }

        private readonly Type itemType;
    }
}