using System;

using Cassandra.Mapping.Attributes;

namespace SkbKontur.DbViewer.TestApi.Cql
{
    [Table("document_printing_info", Keyspace = CqlDbConnectorFactory.Keyspace, CaseSensitive = true)]
    public class DocumentPrintingInfo
    {
        [Column("id")]
        [PartitionKey(0)]
        public Guid Id { get; set; }

        [Column("party_id")]
        [ClusteringKey(0)]
        public string PartyId { get; set; }

        [Column("file_name_without_extension")]
        public string FileNameWithoutExtension { get; set; }

        [Column("file_extension")]
        public string FileExtension { get; set; }

        [Column("file_id")]
        public string FileId { get; set; }

        [Column("status", Type = typeof(int))]
        public DocumentPrintingStatus Status { get; set; }

        [Column("timestamp")]
        public DateTimeOffset Timestamp { get; set; }
    }
}