using System;
using System.Linq;
using System.Threading.Tasks;

using AutoFixture;

using FluentAssertions;

using GroboContainer.Core;
using GroboContainer.Impl;

using NUnit.Framework;

using SKBKontur.Catalogue.CassandraUtils.Cassandra.Commons.Actualization;
using SKBKontur.Catalogue.CassandraUtils.Cassandra.Commons.Mapping;
using SKBKontur.Catalogue.CassandraUtils.Cassandra.SessionTableQueryExtending.PrimitiveStoring;

using SkbKontur.DbViewer.Cql;
using SkbKontur.DbViewer.Dto;
using SkbKontur.DbViewer.Tests.CqlConnector.Configuration;
using SkbKontur.DbViewer.Tests.CqlConnector.TestClasses;
using SkbKontur.DbViewer.Tests.DI;
using SkbKontur.DbViewer.VNext.DataTypes;

namespace SkbKontur.DbViewer.Tests.CqlConnector
{
    public class CqlConnectorTests
    {
        [OneTimeSetUp]
        public void SetUp()
        {
            container = new Container(new ContainerConfiguration(AssembliesLoader.Load()));
            container.Configure();
            var cassandraMapsFromAttributes = container.Get<IMappingsRetriever>().GetAttributeMappings();
            container.Get<ICassandraSchemaActualizer>().Actualize(cassandraMapsFromAttributes);
            foreach (var x in container.Get<ICassandraStorageFactory>()
                                       .GetSimpleCassandraStorages())
            {
                container.Configurator.ForAbstraction(x.GetType()).UseInstances(x);
            }

            connector = (CqlDbConnector<TestDbSearcherObject>)container.Get<CqlDbConnectorFactory>().CreateConnector<TestDbSearcherObject>();
            storage = container.Get<CassandraStorage<TestDbSearcherObject>>();
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
            await storage.WriteAsync(objects11.Concat(objects12).Concat(objects21).Concat(objects22));
            (await connector.Search(new[]
                        {
                            CreateEqualsFilter("PartitionKey1", pk1),
                            CreateEqualsFilter("PartitionKey2", pk21),
                        }, null, 0, 0) as TestDbSearcherObject[]).Should().BeEquivalentTo(objects11.Concat(objects12));
            (await connector.Search(new[]
                        {
                            CreateEqualsFilter("PartitionKey1", pk1),
                            CreateEqualsFilter("PartitionKey2", pk21),
                            CreateEqualsFilter("ClusteringKey1", ck1),
                        }, null, 0, 0) as TestDbSearcherObject[]).Should().BeEquivalentTo(objects11);
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

            await storage.WriteAsync(objects);

            (await connector.Search(new[]
                        {
                            CreateEqualsFilter("PartitionKey1", pk1),
                            CreateEqualsFilter("PartitionKey2", pk2),
                            CreateEqualsFilter("ClusteringKey1", ck),
                            new Filter
                                {
                                    Field = "ClusteringKey2",
                                    Type = ObjectFieldFilterOperator.GreaterThanOrEquals,
                                    Value = objects[4].ClusteringKey2,
                                },
                        }, null, 0, 0) as TestDbSearcherObject[]).Should().BeEquivalentTo(objects.Skip(4));

            (await connector.Search(new[]
                        {
                            CreateEqualsFilter("PartitionKey1", pk1),
                            CreateEqualsFilter("PartitionKey2", pk2),
                            CreateEqualsFilter("ClusteringKey1", ck),
                            new Filter
                                {
                                    Field = "ClusteringKey2",
                                    Type = ObjectFieldFilterOperator.GreaterThan,
                                    Value = objects[4].ClusteringKey2,
                                },
                        }, null, 0, 0) as TestDbSearcherObject[]).Should().BeEquivalentTo(objects.Skip(5));

            (await connector.Search(new[]
                        {
                            CreateEqualsFilter("PartitionKey1", pk1),
                            CreateEqualsFilter("PartitionKey2", pk2),
                            CreateEqualsFilter("ClusteringKey1", ck),
                            new Filter
                                {
                                    Field = "ClusteringKey2",
                                    Type = ObjectFieldFilterOperator.LessThanOrEquals,
                                    Value = objects[4].ClusteringKey2,
                                },
                        }, null, 0, 0) as TestDbSearcherObject[]).Should().BeEquivalentTo(objects.Take(5));

            (await connector.Search(new[]
                        {
                            CreateEqualsFilter("PartitionKey1", pk1),
                            CreateEqualsFilter("PartitionKey2", pk2),
                            CreateEqualsFilter("ClusteringKey1", ck),
                            new Filter
                                {
                                    Field = "ClusteringKey2",
                                    Type = ObjectFieldFilterOperator.LessThan,
                                    Value = objects[4].ClusteringKey2,
                                },
                        }, null, 0, 0) as TestDbSearcherObject[]).Should().BeEquivalentTo(objects.Take(4));
        }

        [Test]
        public async Task Test_Read()
        {
            var fixture = new Fixture();
            var testObject1 = fixture.Create<TestDbSearcherObject>();
            await storage.WriteAsync(testObject1);
            var testObject2 = fixture.Create<TestDbSearcherObject>();
            await storage.WriteAsync(testObject2);
            (await connector.Read(new[]
                        {
                            CreateEqualsFilter("PartitionKey1", testObject1.PartitionKey1),
                            CreateEqualsFilter("PartitionKey2", testObject1.PartitionKey2),
                            CreateEqualsFilter("ClusteringKey1", testObject1.ClusteringKey1),
                            CreateEqualsFilter("ClusteringKey2", testObject1.ClusteringKey2),
                        }) as TestDbSearcherObject).Should().BeEquivalentTo(testObject1);
            (await connector.Read(new[]
                        {
                            CreateEqualsFilter("PartitionKey1", testObject2.PartitionKey1),
                            CreateEqualsFilter("PartitionKey2", testObject2.PartitionKey2),
                            CreateEqualsFilter("ClusteringKey1", testObject2.ClusteringKey1),
                            CreateEqualsFilter("ClusteringKey2", testObject2.ClusteringKey2),
                        }) as TestDbSearcherObject).Should().BeEquivalentTo(testObject2);
        }

        [Test]
        public async Task Test_Write()
        {
            var fixture = new Fixture();
            var testObject1 = fixture.Create<TestDbSearcherObject>();
            await storage.WriteAsync(testObject1);
            var testObject2 = fixture.Create<TestDbSearcherObject>();
            await storage.WriteAsync(testObject2);
            testObject1.Value = Guid.NewGuid().ToString();
            await connector.Write(testObject1);
            (await connector.Read(new[]
                        {
                            CreateEqualsFilter("PartitionKey1", testObject1.PartitionKey1),
                            CreateEqualsFilter("PartitionKey2", testObject1.PartitionKey2),
                            CreateEqualsFilter("ClusteringKey1", testObject1.ClusteringKey1),
                            CreateEqualsFilter("ClusteringKey2", testObject1.ClusteringKey2),
                        }) as TestDbSearcherObject).Should().BeEquivalentTo(testObject1);
            (await connector.Read(new[]
                        {
                            CreateEqualsFilter("PartitionKey1", testObject2.PartitionKey1),
                            CreateEqualsFilter("PartitionKey2", testObject2.PartitionKey2),
                            CreateEqualsFilter("ClusteringKey1", testObject2.ClusteringKey1),
                            CreateEqualsFilter("ClusteringKey2", testObject2.ClusteringKey2),
                        }) as TestDbSearcherObject).Should().BeEquivalentTo(testObject2);
        }

        [Test]
        public async Task Test_Delete()
        {
            var fixture = new Fixture();
            var testObject1 = fixture.Create<TestDbSearcherObject>();
            await storage.WriteAsync(testObject1);
            var testObject2 = fixture.Create<TestDbSearcherObject>();
            await storage.WriteAsync(testObject2);
            await connector.Delete(testObject1);
            (await connector.Read(new[]
                        {
                            CreateEqualsFilter("PartitionKey1", testObject1.PartitionKey1),
                            CreateEqualsFilter("PartitionKey2", testObject1.PartitionKey2),
                            CreateEqualsFilter("ClusteringKey1", testObject1.ClusteringKey1),
                            CreateEqualsFilter("ClusteringKey2", testObject1.ClusteringKey2),
                        }) as TestDbSearcherObject).Should().BeEquivalentTo((TestDbSearcherObject)null);
            (await connector.Read(new[]
                        {
                            CreateEqualsFilter("PartitionKey1", testObject2.PartitionKey1),
                            CreateEqualsFilter("PartitionKey2", testObject2.PartitionKey2),
                            CreateEqualsFilter("ClusteringKey1", testObject2.ClusteringKey1),
                            CreateEqualsFilter("ClusteringKey2", testObject2.ClusteringKey2),
                        }) as TestDbSearcherObject).Should().BeEquivalentTo(testObject2);
        }

        private Filter CreateEqualsFilter<T>(string field, T value)
        {
            return new Filter
                {
                    Field = field,
                    Type = ObjectFieldFilterOperator.Equals,
                    Value = value.ToString(),
                };
        }

        private Container container;
        private CqlDbConnector<TestDbSearcherObject> connector;
        private CassandraStorage<TestDbSearcherObject> storage;
    }
}