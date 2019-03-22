using Kontur.DBViewer.Core.Connector;
using Kontur.DBViewer.Core.GenericHelpers;

namespace Kontur.DBViewer.Core.Schemas
{
    public static class SchemaRegistryExtensions
    {
        public static IDBConnector GetSearcher(this ISchemaRegistry registry, string typeIdentifier)
        {
            var type = registry.GetTypeByTypeIdentifier(typeIdentifier);
            return GenericMethod.Invoke(
                () => registry.GetSchemaByTypeIdentifier(typeIdentifier).SearcherFactory.CreateConnector<object>(),
                typeof(object),
                type
            );
        }
    }
}