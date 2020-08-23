using System;
using System.Linq;
using System.Threading.Tasks;

using AutoFixture;

using FluentAssertions;

using NUnit.Framework;

using SkbKontur.DbViewer.Connector;
using SkbKontur.DbViewer.Cql;
using SkbKontur.DbViewer.DataTypes;
using SkbKontur.DbViewer.TestApi.Cql;

namespace SkbKontur.DbViewer.Tests.CqlConnector
{
    [TestFixture(typeof(CqlDbConnector<TestDbSearcherObject>))]
    [TestFixture(typeof(CqlPagedDbConnector<TestDbSearcherObject>))]
    public class CqlConnectorTests<TConnector>
        where TConnector : IDbConnector
    {
        [OneTimeSetUp]
        public void SetUp()
        {
            connector = new CqlDbConnectorFactory(typeof(TConnector).GetGenericTypeDefinition()).CreateConnector<TestDbSearcherObject>();
        }

        [Test]
        public async Task Test_Search()
        {
            const int count = 10;
            var fixture = new Fixture();
            var pk1 = Guid.NewGuid().ToString();
            var pk21 = Guid.NewGuid();
            var pk22 = Guid.NewGuid();
            var ck1 = 1;
            var ck2 = 2;
            var objects11 = fixture.Build<TestDbSearcherObject>()
                                   .With(x => x.PartitionKey1, pk1)
                                   .With(x => x.PartitionKey2, pk21)
                                   .With(x => x.ClusteringKey1, ck1)
                                   .CreateMany(count)
                                   .ToArray();
            var objects12 = fixture.Build<TestDbSearcherObject>()
                                   .With(x => x.PartitionKey1, pk1)
                                   .With(x => x.PartitionKey2, pk21)
                                   .With(x => x.ClusteringKey1, ck2)
                                   .CreateMany(count)
                                   .ToArray();
            var objects21 = fixture.Build<TestDbSearcherObject>()
                                   .With(x => x.PartitionKey1, pk1)
                                   .With(x => x.PartitionKey2, pk22)
                                   .With(x => x.ClusteringKey1, ck1)
                                   .CreateMany(count)
                                   .ToArray();
            var objects22 = fixture.Build<TestDbSearcherObject>()
                                   .With(x => x.PartitionKey1, pk1)
                                   .With(x => x.PartitionKey2, pk22)
                                   .With(x => x.ClusteringKey1, ck2)
                                   .CreateMany(count)
                                   .ToArray();

            Write(objects11.Concat(objects12).Concat(objects21).Concat(objects22).ToArray());

            var foundByPartitionKey = await connector.Search(new[]
                {
                    CreateEqualsFilter("PartitionKey1", pk1),
                    CreateEqualsFilter("PartitionKey2", pk21),
                }, new Sort[0], 0, 100);
            foundByPartitionKey.Should().BeEquivalentTo(objects11.Concat(objects12));

            var foundWithClusteringKey = await connector.Search(new[]
                {
                    CreateEqualsFilter("PartitionKey1", pk1),
                    CreateEqualsFilter("PartitionKey2", pk21),
                    CreateEqualsFilter("ClusteringKey1", ck1),
                }, new Sort[0], 0, 100);
            foundWithClusteringKey.Should().BeEquivalentTo(objects11);
        }

        [Test]
        public async Task Test_Search_InequalityAtClusteringKey()
        {
            var fixture = new Fixture();
            var pk1 = Guid.NewGuid().ToString();
            var pk2 = Guid.NewGuid();
            var ck = 5;
            var objects = fixture.Build<TestDbSearcherObject>()
                                 .With(x => x.PartitionKey1, pk1)
                                 .With(x => x.PartitionKey2, pk2)
                                 .With(x => x.ClusteringKey1, ck)
                                 .CreateMany(10)
                                 .OrderBy(x => x.ClusteringKey2)
                                 .ToArray();

            Write(objects);

            (await connector.Search(new[]
                        {
                            CreateEqualsFilter("PartitionKey1", pk1),
                            CreateEqualsFilter("PartitionKey2", pk2),
                            CreateEqualsFilter("ClusteringKey1", ck),
                            new Condition
                                {
                                    Path = "ClusteringKey2",
                                    Operator = ObjectFieldFilterOperator.GreaterThanOrEquals,
                                    Value = objects[4].ClusteringKey2,
                                },
                        }, new Sort[0], 0, 100)).Should().BeEquivalentTo(objects.Skip(4));

            (await connector.Search(new[]
                        {
                            CreateEqualsFilter("PartitionKey1", pk1),
                            CreateEqualsFilter("PartitionKey2", pk2),
                            CreateEqualsFilter("ClusteringKey1", ck),
                            new Condition
                                {
                                    Path = "ClusteringKey2",
                                    Operator = ObjectFieldFilterOperator.GreaterThan,
                                    Value = objects[4].ClusteringKey2,
                                },
                        }, new Sort[0], 0, 100)).Should().BeEquivalentTo(objects.Skip(5));

            (await connector.Search(new[]
                        {
                            CreateEqualsFilter("PartitionKey1", pk1),
                            CreateEqualsFilter("PartitionKey2", pk2),
                            CreateEqualsFilter("ClusteringKey1", ck),
                            new Condition
                                {
                                    Path = "ClusteringKey2",
                                    Operator = ObjectFieldFilterOperator.LessThanOrEquals,
                                    Value = objects[4].ClusteringKey2,
                                },
                        }, new Sort[0], 0, 100)).Should().BeEquivalentTo(objects.Take(5));

            (await connector.Search(new[]
                        {
                            CreateEqualsFilter("PartitionKey1", pk1),
                            CreateEqualsFilter("PartitionKey2", pk2),
                            CreateEqualsFilter("ClusteringKey1", ck),
                            new Condition
                                {
                                    Path = "ClusteringKey2",
                                    Operator = ObjectFieldFilterOperator.LessThan,
                                    Value = objects[4].ClusteringKey2,
                                },
                        }, new Sort[0], 0, 100)).Should().BeEquivalentTo(objects.Take(4));
        }

        [Test]
        public async Task Test_Read()
        {
            var fixture = new Fixture();
            var testObject1 = fixture.Create<TestDbSearcherObject>();
            Write(testObject1);
            var testObject2 = fixture.Create<TestDbSearcherObject>();
            Write(testObject2);
            (await connector.Read(BuildIdentityFilter(testObject1))).Should().BeEquivalentTo(testObject1);
            (await connector.Read(BuildIdentityFilter(testObject2))).Should().BeEquivalentTo(testObject2);
        }

        [Test]
        public async Task Test_Write()
        {
            var fixture = new Fixture();
            var testObject1 = fixture.Create<TestDbSearcherObject>();
            Write(testObject1);
            var testObject2 = fixture.Create<TestDbSearcherObject>();
            Write(testObject2);
            testObject1.Value = Guid.NewGuid().ToString();
            await connector.Write(testObject1);
            (await connector.Read(BuildIdentityFilter(testObject1))).Should().BeEquivalentTo(testObject1);
            (await connector.Read(BuildIdentityFilter(testObject2))).Should().BeEquivalentTo(testObject2);
        }

        [Test]
        public async Task Test_Delete()
        {
            var fixture = new Fixture();
            var testObject1 = fixture.Create<TestDbSearcherObject>();
            Write(testObject1);
            var testObject2 = fixture.Create<TestDbSearcherObject>();
            Write(testObject2);
            await connector.Delete(BuildIdentityFilter(testObject1));
            (await connector.Read(BuildIdentityFilter(testObject1))).Should().Be(null);
            (await connector.Read(BuildIdentityFilter(testObject2))).Should().BeEquivalentTo(testObject2);
        }

        private Condition[] BuildIdentityFilter(TestDbSearcherObject obj)
        {
            return new[]
                {
                    CreateEqualsFilter("PartitionKey1", obj.PartitionKey1),
                    CreateEqualsFilter("PartitionKey2", obj.PartitionKey2),
                    CreateEqualsFilter("ClusteringKey1", obj.ClusteringKey1),
                    CreateEqualsFilter("ClusteringKey2", obj.ClusteringKey2),
                };
        }

        private Condition CreateEqualsFilter<T>(string field, T value)
        {
            return new Condition
                {
                    Path = field,
                    Operator = ObjectFieldFilterOperator.Equals,
                    Value = value.ToString(),
                };
        }

        private void Write(params TestDbSearcherObject[] objects)
        {
            using var context = new CqlDbContext();
            context.InsertDocuments(objects);
        }

        private IDbConnector connector;
    }
}