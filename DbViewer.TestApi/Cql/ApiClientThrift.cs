using Cassandra.Mapping.Attributes;

namespace SkbKontur.DbViewer.TestApi.Cql
{
    [Table("api_client_thrift", Keyspace = CqlDbConnectorFactory.Keyspace, CaseSensitive = true)]
    public class ApiClientThrift
    {
        [PartitionKey(0)]
        [Column("scope_id")]
        public string ScopeId { get; set; }

        [PartitionKey(1)]
        [Column("id")]
        public string Id { get; set; }

        [PartitionKey(2)]
        [Column("array_index")]
        public string ArrayIndex { get; set; }

        [Column("description")]
        public string Description { get; set; }
    }
}