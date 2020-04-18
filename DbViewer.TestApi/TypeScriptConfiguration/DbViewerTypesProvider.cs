using System.Linq;

using SkbKontur.DbViewer.TestApi.Controllers;
using SkbKontur.TypeScript.ContractGenerator;
using SkbKontur.TypeScript.ContractGenerator.Abstractions;
using SkbKontur.TypeScript.ContractGenerator.Internals;

namespace SkbKontur.DbViewer.TestApi.TypeScriptConfiguration
{
    public class DbViewerTypesProvider : ITypesProvider
    {
        public ITypeInfo[] GetRootTypes()
        {
            return new[] {TypeInfo.From<DbViewerApiController>()};
        }

        public ITypeInfo[] GetAssemblyTypes(ITypeInfo type)
        {
            return ((TypeInfo)type).Type.Assembly.GetTypes().Select(TypeInfo.From).ToArray();
        }
    }
}