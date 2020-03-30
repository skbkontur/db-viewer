using System;
using System.Collections.Generic;
using System.Linq;

namespace SkbKontur.DbViewer.Schemas
{
    public class SchemaRegistry : ISchemaRegistry
    {
        public SchemaRegistry()
        {
            schemasByName = new Dictionary<string, Schema>();
            schemaNameByTypeIdentifier = new Dictionary<string, string>();
            typeByTypeIdentifier = new Dictionary<string, Type>();
        }

        public void Add(Schema schema)
        {
            schemasByName.Add(schema.Description.SchemaName, schema);
            foreach (var type in schema.Types)
            {
                schemaNameByTypeIdentifier.Add(type.TypeIdentifier, schema.Description.SchemaName);
                typeByTypeIdentifier.Add(type.TypeIdentifier, type.Type);
            }
        }

        public Schema[] GetAllSchemas()
        {
            return schemasByName.Values.ToArray();
        }

        public Schema GetSchemaByName(string schemaName)
        {
            return schemasByName[schemaName];
        }

        public Schema GetSchemaByTypeIdentifier(string typeIdentifier)
        {
            return schemasByName[schemaNameByTypeIdentifier[typeIdentifier]];
        }

        public Type GetTypeByTypeIdentifier(string typeIdentifier)
        {
            return typeByTypeIdentifier[typeIdentifier];
        }

        private readonly IDictionary<string, Schema> schemasByName;
        private readonly IDictionary<string, string> schemaNameByTypeIdentifier;
        private readonly IDictionary<string, Type> typeByTypeIdentifier;
    }
}