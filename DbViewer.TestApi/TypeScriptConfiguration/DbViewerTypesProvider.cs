using SkbKontur.DbViewer.TestApi.Controllers;
using SkbKontur.TypeScript.ContractGenerator;
using SkbKontur.TypeScript.ContractGenerator.Abstractions;
using SkbKontur.TypeScript.ContractGenerator.Internals;

namespace SkbKontur.DbViewer.TestApi.TypeScriptConfiguration
{
    public class DbViewerTypesProvider : IRootTypesProvider
    {
        public ITypeInfo[] GetRootTypes()
        {
            return new[] {TypeInfo.From<DbViewerApiController>()};
        }
    }
}