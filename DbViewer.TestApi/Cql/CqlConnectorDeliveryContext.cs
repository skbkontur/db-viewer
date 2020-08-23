using System;

using Cassandra;
using Cassandra.Mapping.Attributes;

using SkbKontur.DbViewer.TestApi.Impl.Attributes;

namespace SkbKontur.DbViewer.TestApi.Cql
{
    [Table(Name = "connector_delivery_contexts", Keyspace = CqlDbConnectorFactory.Keyspace, CaseSensitive = true)]
    public class CqlConnectorDeliveryContext
    {
        [PartitionKey(0)]
        [Column("time_slice_id")]
        public DateTimeOffset TimeSliceId { get; set; }

        [PartitionKey(1)]
        [Column("time_slice_shard")]
        public sbyte TimeSliceShardNumber { get; set; }

        [ClusteringKey(0)]
        [Column("context_id")]
        public TimeUuid ContextId { get; set; }

        [Column("context_content")]
        [Serialized(typeof(ConnectorDeliveryContext))]
        public byte[] ContextContent { get; set; }
    }
}