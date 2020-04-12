using System;
using System.Diagnostics;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

using AutoFixture;

using Cassandra;
using Cassandra.Data.Linq;

using FluentAssertions;

using NUnit.Framework;

using SkbKontur.DbViewer.Connector;
using SkbKontur.DbViewer.DataTypes;
using SkbKontur.DbViewer.TestApi.Cql;

namespace SkbKontur.DbViewer.Tests.CqlConnector
{
    [NUnit.Framework.Ignore("Unable to run integration tests")]
    public class CqlConnectorTests
    {
        private static ISession TryConnectToCassandra(TimeSpan timeout, TimeSpan interval)
        {
            var sw = Stopwatch.StartNew();
            while (sw.Elapsed < timeout)
            {
                try
                {
                    var session = Cluster.Builder().AddContactPoint("127.0.0.1").Build().Connect();
                    Console.WriteLine($"Successfully connected to cassandra after {sw.Elapsed.TotalSeconds} seconds");
                    return session;
                }
                catch (NoHostAvailableException)
                {
                }

                Thread.Sleep(interval);
            }

            throw new InvalidOperationException($"Failed to wait for local cassandra node to start in {timeout.TotalSeconds} seconds");
        }

        [OneTimeSetUp]
        public void SetUp()
        {
            var session = TryConnectToCassandra(timeout : TimeSpan.FromMinutes(1), interval : TimeSpan.FromSeconds(1));
            session.CreateKeyspaceIfNotExists(CqlDbConnectorFactory.Keyspace);
            table = new Table<TestDbSearcherObject>(session);
            table.CreateIfNotExists();
            connector = new CqlDbConnectorFactory().CreateConnector<TestDbSearcherObject>();
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
            (await connector.Read(new[]
                        {
                            CreateEqualsFilter("PartitionKey1", testObject1.PartitionKey1),
                            CreateEqualsFilter("PartitionKey2", testObject1.PartitionKey2),
                            CreateEqualsFilter("ClusteringKey1", testObject1.ClusteringKey1),
                            CreateEqualsFilter("ClusteringKey2", testObject1.ClusteringKey2),
                        })).Should().BeEquivalentTo(testObject1);
            (await connector.Read(new[]
                        {
                            CreateEqualsFilter("PartitionKey1", testObject2.PartitionKey1),
                            CreateEqualsFilter("PartitionKey2", testObject2.PartitionKey2),
                            CreateEqualsFilter("ClusteringKey1", testObject2.ClusteringKey1),
                            CreateEqualsFilter("ClusteringKey2", testObject2.ClusteringKey2),
                        })).Should().BeEquivalentTo(testObject2);
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
            (await connector.Read(new[]
                        {
                            CreateEqualsFilter("PartitionKey1", testObject1.PartitionKey1),
                            CreateEqualsFilter("PartitionKey2", testObject1.PartitionKey2),
                            CreateEqualsFilter("ClusteringKey1", testObject1.ClusteringKey1),
                            CreateEqualsFilter("ClusteringKey2", testObject1.ClusteringKey2),
                        })).Should().BeEquivalentTo(testObject1);
            (await connector.Read(new[]
                        {
                            CreateEqualsFilter("PartitionKey1", testObject2.PartitionKey1),
                            CreateEqualsFilter("PartitionKey2", testObject2.PartitionKey2),
                            CreateEqualsFilter("ClusteringKey1", testObject2.ClusteringKey1),
                            CreateEqualsFilter("ClusteringKey2", testObject2.ClusteringKey2),
                        })).Should().BeEquivalentTo(testObject2);
        }

        [Test]
        public async Task Test_Delete()
        {
            var fixture = new Fixture();
            var testObject1 = fixture.Create<TestDbSearcherObject>();
            Write(testObject1);
            var testObject2 = fixture.Create<TestDbSearcherObject>();
            Write(testObject2);
            await connector.Delete(testObject1);
            (await connector.Read(new[]
                        {
                            CreateEqualsFilter("PartitionKey1", testObject1.PartitionKey1),
                            CreateEqualsFilter("PartitionKey2", testObject1.PartitionKey2),
                            CreateEqualsFilter("ClusteringKey1", testObject1.ClusteringKey1),
                            CreateEqualsFilter("ClusteringKey2", testObject1.ClusteringKey2),
                        })).Should().Be(null);
            (await connector.Read(new[]
                        {
                            CreateEqualsFilter("PartitionKey1", testObject2.PartitionKey1),
                            CreateEqualsFilter("PartitionKey2", testObject2.PartitionKey2),
                            CreateEqualsFilter("ClusteringKey1", testObject2.ClusteringKey1),
                            CreateEqualsFilter("ClusteringKey2", testObject2.ClusteringKey2),
                        })).Should().BeEquivalentTo(testObject2);
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
            foreach (var o in objects)
                table.Insert(o).SetTimestamp(DateTimeOffset.UtcNow).Execute();
        }

        private IDbConnector connector;
        private Table<TestDbSearcherObject> table;
    }
}