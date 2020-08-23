using System;

using AutoFixture;

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
            using var context = new CqlDbContext();
            CreateTable<CqlDocumentMeta>(context, 100);
            CreateTable<CqlOrganizationInfo>(context, 1000);
            CreateTable<CqlUserInfo>(context, 1500);
            CreateTable<DocumentBindingsMeta>(context, 150);
            CreateTable<DocumentPrintingInfo>(context, 11000);
            CreateTable<DocumentStorageElement>(context, 123);
        }

        private static void CreateTable<T>(CqlDbContext context, int count)
        {
            context.DropTable<T>();
            var table = context.GetTable<T>();

            var fixture = new Fixture();
            fixture.Register((DateTime dt) => dt.ToLocalDate());
            fixture.Register((DateTime dt) => CassandraPrimitivesExtensions.ToLocalTime(dt));

            for (var i = 0; i < count; i++)
                table.Insert(fixture.Create<T>()).SetTimestamp(DateTimeOffset.UtcNow).Execute();
        }
    }
}