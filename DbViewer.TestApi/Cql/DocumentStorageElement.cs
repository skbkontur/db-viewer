using System;

using Cassandra;
using Cassandra.Mapping.Attributes;

namespace SkbKontur.DbViewer.TestApi.Cql
{
    [Table("document_storage_element", Keyspace = CqlDbConnectorFactory.Keyspace, CaseSensitive = true)]
    public class DocumentStorageElement
    {
        [Column("scope_id")]
        [PartitionKey(0)]
        public Guid ScopeId { get; set; }

        [Column("id")]
        [PartitionKey(1)]
        public TimeUuid Id { get; set; }

        [Column("document_number")]
        [ClusteringKey(0)]
        public string DocumentNumber { get; set; }

        [Column("document_date")]
        [ClusteringKey(1)]
        public LocalDate DocumentDate { get; set; }

        [Column("document_time")]
        [ClusteringKey(2)]
        public LocalTime DocumentTime { get; set; }

        [Column("document_content")]
        public byte[] DocumentContent { get; set; }
    }
}