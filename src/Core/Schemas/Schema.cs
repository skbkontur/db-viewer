using Kontur.DBViewer.Core.Connector;
using Kontur.DBViewer.Core.TypeInformation;

namespace Kontur.DBViewer.Core.Schemas
{
    public class Schema
    {
        public SchemaDescription Description { get; set; }
        public IDBConnectorFactory ConnectorsFactory { get; set; }
        public ICustomPropertyConfigurationProvider CustomPropertyConfigurationProvider { get; set; }
        public IPropertyDescriptionBuilder PropertyDescriptionBuilder { get; set; }
        public TypeDescription[] Types { get; set; }
    }
}