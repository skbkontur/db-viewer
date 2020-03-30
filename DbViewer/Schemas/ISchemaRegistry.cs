using System;

namespace SkbKontur.DbViewer.Schemas
{
    public interface ISchemaRegistry
    {
        void Add(Schema schema);
        Schema[] GetAllSchemas();
        Schema GetSchemaByName(string schemaName);
        Schema GetSchemaByTypeIdentifier(string typeIdentifier);
        Type GetTypeByTypeIdentifier(string typeIdentifier);
    }
}