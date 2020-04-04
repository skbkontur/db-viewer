using System;
using System.Collections.Generic;

using Cassandra.Mapping.Attributes;

namespace SkbKontur.DbViewer.TestApi.Cql
{
    [Table("cql_document_meta", Keyspace = CqlDbConnectorFactory.Keyspace, CaseSensitive = true)]
    public class CqlDocumentMeta
    {
        [Column("from_id")]
        [PartitionKey(0)]
        public string FromId { get; set; }

        [Column("to_id")]
        [PartitionKey(1)]
        public string ToId { get; set; }

        [Column("is_large_document")]
        [ClusteringKey(0)]
        public bool IsLargeDocument { get; set; }

        [Column("shard_number")]
        [ClusteringKey(1)]
        public short ShardNumber { get; set; }

        [Column("document_length")]
        [ClusteringKey(2)]
        public long DocumentLength { get; set; }

        [Column("document_price")]
        [ClusteringKey(3)]
        public decimal DocumentPrice { get; set; }

        [Column("document_send_time")]
        [ClusteringKey(4)]
        public DateTimeOffset DocumentSendTime { get; set; }

        [Column("document_tags")]
        public IEnumerable<string> DocumentTags { get; set; }

        [Column("document_values")]
        public IDictionary<string, string> DocumentValues { get; set; }
    }
}