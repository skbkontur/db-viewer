using System;

using AutoFixture;

using GroBuf;
using GroBuf.DataMembersExtracters;

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
            CreateTable<CqlDocument>(context, 123);
        }

        private void CreateTable<T>(CqlDbContext context, int count)
            where T : class
        {
            context.DropTable<T>();
            var table = context.GetTable<T>();

            var fixture = new Fixture();
            fixture.Register((DateTime dt) => dt.ToLocalDate());
            fixture.Register((DateTime dt) => CassandraPrimitivesExtensions.ToLocalTime(dt));

            for (var i = 0; i < count; i++)
                table.Insert(Modify<T>(fixture)).SetTimestamp(DateTimeOffset.UtcNow).Execute();
        }

        private T Modify<T>(Fixture fixture)
            where T : class
        {
            var document = fixture.Create<T>();
            if (document is DocumentBindingsMeta meta)
            {
                meta.EntityMetaBytes = serializer.Serialize(fixture.Create<EntityMeta>());
                meta.DocumentWithoutGoodItemsBytes = serializer.Serialize(fixture.Create<Document>());
                return (meta as T)!;
            }
            return document;
        }

        private readonly ISerializer serializer = new Serializer(new AllPropertiesExtractor());
    }
}