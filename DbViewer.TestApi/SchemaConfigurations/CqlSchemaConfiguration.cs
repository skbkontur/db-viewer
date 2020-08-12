﻿using SkbKontur.DbViewer.Configuration;
using SkbKontur.DbViewer.Connector;
using SkbKontur.DbViewer.Cql;
using SkbKontur.DbViewer.DataTypes;
using SkbKontur.DbViewer.Schemas;
using SkbKontur.DbViewer.TestApi.Cql;

namespace SkbKontur.DbViewer.TestApi.SchemaConfigurations
{
    public class CqlSchemaConfiguration : ISchemaConfiguration
    {
        public CqlSchemaConfiguration()
        {
            ConnectorsFactory = new CqlDbConnectorFactory(typeof(CqlDbConnector<>));
            PropertyDescriptionBuilder = new CqlPropertyDescriptionBuilder();
        }

        public SchemaDescription Description => new SchemaDescription
            {
                AllowReadAll = true,
                CountLimit = 10_000,
                DownloadLimit = 100_000,
                SchemaName = "CQL Objects",
                AllowDelete = true,
                AllowEdit = true,
            };

        public TypeDescription[] Types => new[]
            {
                typeof(DocumentBindingsMeta),
                typeof(DocumentPrintingInfo),
                typeof(DocumentStorageElement),
            }.ToTypeDescriptions();

        public IDbConnectorFactory ConnectorsFactory { get; }
        public IPropertyDescriptionBuilder PropertyDescriptionBuilder { get; }
    }
}