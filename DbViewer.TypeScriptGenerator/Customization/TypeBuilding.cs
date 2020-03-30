using System;

using SkbKontur.TypeScript.ContractGenerator.TypeBuilders;

namespace SkbKontur.DbViewer.TypeScriptGenerator.Customization
{
    public static class TypeBuilding
    {
        public static ITypeBuildingContext RedirectToType(string typeName, string path, Type type)
        {
            return new RedirectToTypeBuildingContext(typeName, path, type);
        }
    }
}