using System;

using Cassandra.Mapping.Attributes;

using SKBKontur.Catalogue.CassandraUtils.Cassandra.Commons.Mapping.Declarative.AttributesDefinition;

namespace SkbKontur.DbViewer.Tests.CqlConnector.TestClasses
{
    [CassandraTable(Keyspace = "dbviewer", Table = "TestObjectTable")]
    public class TestDbSearcherObject
    {
        [PartitionKey(0)]
        public string PartitionKey1 { get; set; }

        [PartitionKey(1)]
        public Guid PartitionKey2 { get; set; }

        [ClusteringKey(0)]
        public int ClusteringKey1 { get; set; }

        [ClusteringKey(1)]
        public string ClusteringKey2 { get; set; }

        [Column]
        public string Value { get; set; }
    }
}