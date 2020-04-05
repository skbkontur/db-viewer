using System;

using AutoFixture;

using Cassandra;
using Cassandra.Data.Linq;

using NUnit.Framework;

using SkbKontur.DbViewer.Cql.CustomPropertyConfigurations;
using SkbKontur.DbViewer.TestApi.Cql;

namespace SkbKontur.DbViewer.Tests.CqlConnector
{
    public class CqlDbSchemaUpdater
    {
        [Test]
        [Explicit]
        public void Test()
        {
            var session = Cluster.Builder().AddContactPoint("127.0.0.1").Build().Connect();
            session.CreateKeyspaceIfNotExists(CqlDbConnectorFactory.Keyspace);
            CreateTable<CqlDocumentMeta>(session, 100);
            CreateTable<CqlOrganizationInfo>(session, 1000);
            CreateTable<CqlUserInfo>(session, 1500);
            CreateTable<DocumentBindingsMeta>(session, 150);
            CreateTable<DocumentPrintingInfo>(session, 11000);
            CreateTable<DocumentStorageElement>(session, 123);
        }

        private static void CreateTable<T>(ISession session, int count)
        {
            var table = new Table<T>(session);
            session.Execute($"DROP TABLE IF EXISTS {table.KeyspaceName}.{table.Name};");
            table.CreateIfNotExists();

            var fixture = new Fixture();
            fixture.Register((DateTime dt) => dt.ToLocalDate());
            fixture.Register((DateTime dt) => CassandraPrimitivesExtensions.ToLocalTime(dt));

            for (var i = 0; i < count; i++)
                table.Insert(fixture.Create<T>()).SetTimestamp(DateTimeOffset.UtcNow).Execute();
        }
    }
}