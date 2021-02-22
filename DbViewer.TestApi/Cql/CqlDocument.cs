using System;

using Cassandra.Mapping.Attributes;

using SkbKontur.DbViewer.TestApi.Impl.Attributes;
using SkbKontur.DbViewer.TestApi.Impl.Document;

namespace SkbKontur.DbViewer.TestApi.Cql
{
    [Table("cql_document", Keyspace = CqlDbConnectorFactory.Keyspace, CaseSensitive = true)]
    public class CqlDocument : IDocument
    {
        [Column("id")]
        [PartitionKey(0)]
        public Guid Id { get; set; }

        [Column("document_number")]
        public string DocumentNumber { get; set; }

        [Column("document_date")]
        public DateTimeOffset DocumentDate { get; set; }

        [Column("document_type", Type = typeof(sbyte))]
        public DocumentType DocumentType { get; set; }

        [Column("is_large_document")]
        public bool IsLargeDocument { get; set; }

        [Column("shard_number")]
        public int ShardNumber { get; set; }

        [Column("document_price")]
        public decimal DocumentPrice { get; set; }

        [Column("document_content")]
        [Serialized(typeof(DocumentContent))]
        public byte[] DocumentContent { get; set; }
    }
}