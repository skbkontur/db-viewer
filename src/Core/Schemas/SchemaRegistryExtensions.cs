using Kontur.DBViewer.Core.GenericHelpers;
using Kontur.DBViewer.Core.Searcher;

namespace Kontur.DBViewer.Core.Schemas
{
    public static class SchemaRegistryExtensions
    {
        public static IObjectsSearcher GetSearcher(this ISchemaRegistry registry, string typeIdentifier)
        {
            var type = registry.GetTypeByTypeIdentifier(typeIdentifier);
            return GenericMethod.Invoke(
                () => registry.GetSchemaByTypeIdentifier(typeIdentifier).SearcherFactory.CreateSearcher<object>(),
                typeof(object),
                type
            );
        }
    }
}