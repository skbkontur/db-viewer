using SkbKontur.DbViewer.Configuration;
using SkbKontur.DbViewer.Connector;
using SkbKontur.DbViewer.DataTypes;
using SkbKontur.DbViewer.EntityFramework;
using SkbKontur.DbViewer.Schemas;
using SkbKontur.DbViewer.TestApi.EntityFramework;
using SkbKontur.DbViewer.TestApi.Impl.Attributes;

namespace SkbKontur.DbViewer.TestApi.SchemaConfigurations
{
    public class PostgresSchemaConfiguration : ISchemaConfiguration
    {
        public PostgresSchemaConfiguration(EntityFrameworkDbConnectorFactory connectorFactory)
        {
            ConnectorsFactory = connectorFactory;
            PropertyDescriptionBuilder = new EntityFrameworkPropertyDescriptionBuilder<IdentityAttribute, IndexedAttribute>();
        }

        public SchemaDescription Description => new SchemaDescription
            {
                AllowReadAll = true,
                CountLimit = 10_000,
                DownloadLimit = 100_000,
                SchemaName = "Postgres Objects",
                AllowDelete = true,
                AllowEdit = true,
            };

        public TypeDescription[] Types => EntityFrameworkDbContext.EntityTypes.ToTypeDescriptions();
        public IDbConnectorFactory ConnectorsFactory { get; }
        public IPropertyDescriptionBuilder PropertyDescriptionBuilder { get; }
    }
}