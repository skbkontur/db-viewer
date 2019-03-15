using System;

namespace Kontur.DBViewer.Core.Schemas
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