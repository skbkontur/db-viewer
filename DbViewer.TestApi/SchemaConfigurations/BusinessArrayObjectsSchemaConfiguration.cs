using SkbKontur.DbViewer.Configuration;
using SkbKontur.DbViewer.Connector;
using SkbKontur.DbViewer.Cql;
using SkbKontur.DbViewer.DataTypes;
using SkbKontur.DbViewer.Schemas;
using SkbKontur.DbViewer.TestApi.Cql;

namespace SkbKontur.DbViewer.TestApi.SchemaConfigurations
{
    public class BusinessArrayObjectsSchemaConfiguration : ISchemaConfiguration
    {
        public BusinessArrayObjectsSchemaConfiguration()
        {
            ConnectorsFactory = new CqlDbConnectorFactory(typeof(CqlDbConnector<>));
            PropertyDescriptionBuilder = new CqlPropertyDescriptionBuilder();
        }

        public SchemaDescription Description => new SchemaDescription
            {
                CountLimit = 10_000,
                DownloadLimit = 100_000,
                SchemaName = "Business Array Objects",
                AllowDelete = true,
                AllowEdit = true,
            };

        public TypeDescription[] Types => new[] {typeof(ApiClientThrift)}.ToTypeDescriptions();

        public IDbConnectorFactory ConnectorsFactory { get; }
        public IPropertyDescriptionBuilder PropertyDescriptionBuilder { get; }
    }
}