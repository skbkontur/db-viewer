using Kontur.DBViewer.Core.Connector;
using Kontur.DBViewer.Core.GenericHelpers;

namespace Kontur.DBViewer.Core.Schemas
{
    public static class SchemaRegistryExtensions
    {
        public static IDBConnector GetConnector(this ISchemaRegistry registry, string typeIdentifier)
        {
            var type = registry.GetTypeByTypeIdentifier(typeIdentifier);
            return GenericMethod.Invoke(
                () => registry.GetSchemaByTypeIdentifier(typeIdentifier).ConnectorsFactory.CreateConnector<object>(),
                typeof(object),
                type
            );
        }
    }
}