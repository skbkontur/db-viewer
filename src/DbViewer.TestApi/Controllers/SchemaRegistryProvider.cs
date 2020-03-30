using SkbKontur.DbViewer.Schemas;

namespace SkbKontur.DbViewer.TestApi.Controllers
{
    public static class SchemaRegistryProvider
    {
        public static void SetSchemaRegistry(SchemaRegistry schemaRegistry)
        {
            registry = schemaRegistry;
        }

        public static SchemaRegistry GetSchemaRegistry()
        {
            return registry;
        }

        private static SchemaRegistry registry = new SchemaRegistry();
    }
}