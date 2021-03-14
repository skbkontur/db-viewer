using SkbKontur.DbViewer.Configuration;
using SkbKontur.DbViewer.Connector;
using SkbKontur.DbViewer.DataTypes;
using SkbKontur.DbViewer.EntityFramework;
using SkbKontur.DbViewer.Schemas;
using SkbKontur.DbViewer.TestApi.EntityFramework;
using SkbKontur.DbViewer.TestApi.Impl.Attributes;

namespace SkbKontur.DbViewer.TestApi.SchemaConfigurations
{
    public class LargeObjectsSchemaConfiguration : ISchemaConfiguration
    {
        public LargeObjectsSchemaConfiguration(EntityFrameworkDbConnectorFactory connectorFactory)
        {
            ConnectorsFactory = connectorFactory;
            PropertyDescriptionBuilder = new EntityFrameworkPropertyDescriptionBuilder<IdentityAttribute, IndexedAttribute>();
        }

        public SchemaDescription Description => new SchemaDescription
            {
                AllowReadAll = true,
                CountLimit = 50_000,
                CountLimitForSuperUser = 1_000_000,
                DownloadLimit = 50_000,
                DownloadLimitForSuperUser = 1_000_000,
                SchemaName = "Large Objects",
                AllowDelete = true,
                AllowEdit = true,
            };

        public TypeDescription[] Types => new[] {typeof(TestTable)}.ToTypeDescriptions();
        public IDbConnectorFactory ConnectorsFactory { get; }
        public IPropertyDescriptionBuilder PropertyDescriptionBuilder { get; }
    }
}