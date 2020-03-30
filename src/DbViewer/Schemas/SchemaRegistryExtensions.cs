using SkbKontur.DbViewer.Connector;
using SkbKontur.DbViewer.GenericHelpers;

namespace SkbKontur.DbViewer.Schemas
{
    public static class SchemaRegistryExtensions
    {
        public static IDbConnector GetConnector(this ISchemaRegistry registry, string typeIdentifier)
        {
            var type = registry.GetTypeByTypeIdentifier(typeIdentifier);
            return GenericMethod.Invoke(() => registry.GetSchemaByTypeIdentifier(typeIdentifier).ConnectorsFactory.CreateConnector<object>(), typeof(object), type);
        }
    }
}