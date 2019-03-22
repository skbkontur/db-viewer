using Kontur.DBViewer.Core.Connector;

namespace Kontur.DBViewer.Core.Schemas
{
    public class Schema
    {
        public SchemaDescription Description { get; set; }
        public IDBConnectorFactory ConnectorsFactory { get; set; }
        public ITypeInfoExtractor TypeInfoExtractor { get; set; }
        public TypeDescription[] Types { get; set; }
    }
}