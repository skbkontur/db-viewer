using Kontur.DBViewer.Core.Schemas;

namespace Kontur.DBViewer.SampleApi.Controllers
{
    public static class SchemaRegistryProvider
    {
        private static SchemaRegistry registry = new SchemaRegistry();

        public static void SetSchemaRegistry(SchemaRegistry schemaRegistry)
        {
            registry = schemaRegistry;
        }

        public static SchemaRegistry GetSchemaRegistry()
        {
            return registry;
        }
    }
}