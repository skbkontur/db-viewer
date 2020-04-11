using Cassandra.Mapping.Attributes;

namespace SkbKontur.DbViewer.TestApi.Cql
{
    [Table("cql_organization_info", Keyspace = CqlDbConnectorFactory.Keyspace, CaseSensitive = true)]
    public class CqlOrganizationInfo
    {
        [Column("id")]
        [PartitionKey(0)]
        public string Id { get; set; }

        [Column("name")]
        public string Name { get; set; }
    }
}