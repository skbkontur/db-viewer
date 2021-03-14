using System;

using Cassandra.Mapping.Attributes;

namespace SkbKontur.DbViewer.TestApi.Cql
{
    [Table("active_diadoc_box_states", Keyspace = CqlDbConnectorFactory.Keyspace, CaseSensitive = true)]
    public class CqlActiveBoxState
    {
        [PartitionKey]
        [Column("partition_key")]
        public string PartitionKey { get; set; }

        [ClusteringKey]
        [Column("box_id")]
        public Guid BoxId { get; set; }

        [Column("last_processed_event_id")]
        public string LastProcessedEventId { get; set; }

        [Column("is_being_observed")]
        public bool IsBeingObserved { get; set; }

        [Column("content")]
        public byte[] Content { get; set; }
    }
}