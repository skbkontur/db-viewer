using System;
using System.Threading.Tasks;

using AutoFixture;

using Cassandra;
using Cassandra.Data.Linq;

using Microsoft.EntityFrameworkCore;

using NUnit.Framework;

using SkbKontur.DbViewer.Cql.CustomPropertyConfigurations;
using SkbKontur.DbViewer.TestApi.Cql;
using SkbKontur.DbViewer.TestApi.EntityFramework;

namespace SkbKontur.DbViewer.Tests.EntityFramework
{
    public class EntityFrameworkDbSchemaUpdater
    {
        [Test]
        [Explicit]
        public async Task Test()
        {
            await using var context = new EntityFrameworkDbContext();
            CreateTable<CqlDocumentMeta>(context, 100);
            CreateTable<CqlOrganizationInfo>(context, 1000);
            CreateTable<CqlUserInfo>(context, 1500);
            CreateTable<DocumentBindingsMeta>(context, 150);
            CreateTable<DocumentPrintingInfo>(context, 11000);
            CreateTable<DocumentStorageElement>(context, 123);
        }

        private static void CreateTable<T>(DbContext context, int count)
            where T : class
        {
            var table = context.Set<T>()
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