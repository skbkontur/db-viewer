using SkbKontur.DbViewer.Configuration;
using SkbKontur.DbViewer.Connector;
using SkbKontur.DbViewer.DataTypes;

namespace SkbKontur.DbViewer.Schemas
{
    public class Schema
    {
        public SchemaDescription Description { get; set; }
        public IDbConnectorFactory ConnectorsFactory { get; set; }
        public ICustomPropertyConfigurationProvider CustomPropertyConfigurationProvider { get; set; }
        public IPropertyDescriptionBuilder PropertyDescriptionBuilder { get; set; }
        public TypeDescription[] Types { get; set; }
    }
}