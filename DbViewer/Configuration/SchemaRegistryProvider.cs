using System.Linq;

using SkbKontur.DbViewer.Schemas;

namespace SkbKontur.DbViewer.Configuration
{
    public class SchemaRegistryProvider
    {
        public SchemaRegistryProvider(ISchemaConfiguration[] schemaConfigurations, ICustomPropertyConfigurationProvider customPropertyConfigurationProvider)
        {
            schemaRegistry = new SchemaRegistry();
            foreach (var schemaConfiguration in schemaConfigurations.OrderBy(x => x.Description.SchemaName))
                schemaRegistry.Add(schemaConfiguration.GetSchema(customPropertyConfigurationProvider));
        }

        public SchemaRegistry GetSchemaRegistry()
        {
            return schemaRegistry;
        }

        private readonly SchemaRegistry schemaRegistry;
    }
}