using SkbKontur.DbViewer.Configuration;
using SkbKontur.DbViewer.Connector;
using SkbKontur.DbViewer.DataTypes;
using SkbKontur.DbViewer.Schemas;
using SkbKontur.DbViewer.TestApi.Impl;
using SkbKontur.DbViewer.TestApi.Impl.Classes;

namespace SkbKontur.DbViewer.TestApi.SchemaConfigurations
{
    public class SampleSchemaConfiguration : ISchemaConfiguration
    {
        public SampleSchemaConfiguration()
        {
            ConnectorsFactory = new SampleIdbConnectorFactory();
            PropertyDescriptionBuilder = new SamplePropertyDescriptionBuilder();
        }

        public SchemaDescription Description => new SchemaDescription
            {
                SchemaName = "SampleSchema",
                DownloadLimit = 100_000,
                CountLimit = 10_000,
                AllowReadAll = true,
                AllowEdit = true,
            };

        public TypeDescription[] Types => new[]
            {
                typeof(TestClass),
                typeof(RidiculousUseCasesClass),
            }.ToTypeDescriptions();

        public IDbConnectorFactory ConnectorsFactory { get; }
        public IPropertyDescriptionBuilder PropertyDescriptionBuilder { get; }
    }
}