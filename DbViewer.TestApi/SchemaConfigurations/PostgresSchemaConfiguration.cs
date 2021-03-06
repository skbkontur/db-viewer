﻿using System.Linq;

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
                CountLimit = 50_000,
                CountLimitForSuperUser = 1_000_000,
                DownloadLimit = 50_000,
                DownloadLimitForSuperUser = 1_000_000,
                SchemaName = "Postgres Objects",
                AllowDelete = true,
                AllowEdit = true,
                AllowSort = true,
            };

        public TypeDescription[] Types => EntityFrameworkDbContext.EntityTypes
                                                                  .Where(x => x != typeof(TestTable))
                                                                  .ToArray()
                                                                  .ToTypeDescriptions();

        public IDbConnectorFactory ConnectorsFactory { get; }
        public IPropertyDescriptionBuilder PropertyDescriptionBuilder { get; }
    }
}