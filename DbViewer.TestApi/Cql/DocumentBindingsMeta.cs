using System;

using Cassandra;
using Cassandra.Mapping.Attributes;

namespace SkbKontur.DbViewer.TestApi.Cql
{
    [Table("document_bindings_meta", Keyspace = CqlDbConnectorFactory.Keyspace, CaseSensitive = true)]
    public class DocumentBindingsMeta
    {
        [Column("binding_type", Type = typeof(sbyte))]
        [PartitionKey(0)]
        public DocumentBindingType BindingType { get; set; }

        [Column("first_partner_party_id")]
        [PartitionKey(1)]
        public string FirstPartnerPartyId { get; set; }

        [Column("second_partner_party_id")]
        [PartitionKey(2)]
        public string SecondPartnerPartyId { get; set; }

        [Column("document_number")]
        [PartitionKey(3)]
        public string DocumentNumber { get; set; }

        [Column("document_date")]
        [PartitionKey(4)]
        public LocalDate DocumentDate { get; set; }

        [Column("document_time")]
        [PartitionKey(5)]
        public LocalTime DocumentTime { get; set; }

        [Column("document_type")]
        [ClusteringKey(0)]
        public string DocumentType { get; set; }

        [Column("document_circulation_id")]
        [ClusteringKey(1)]
        public TimeUuid DocumentCirculationId { get; set; }

        [Column("date_time")]
        [ClusteringKey(2)]
        public DateTimeOffset DateTime { get; set; }

        [Column("document_without_good_items_bytes")]
        public byte[] DocumentWithoutGoodItemsBytes { get; set; }

        [Column("entity_meta_bytes")]
        public byte[] EntityMetaBytes { get; set; }
    }
}