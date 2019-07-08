using System;
using Cassandra.Mapping.Attributes;

namespace Kontur.DBViewer.SampleApi.Impl.Classes
{
    [Table("document_printing_info", Keyspace = "EdiCoreKeyspace", CaseSensitive = true)]
    public class TestCqlWorking
    {
        [Column("id")]
        [PartitionKey(0)]
        public Guid Id { get; set; }

        [Column("party_id")]
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