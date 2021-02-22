using System;
using System.ComponentModel.DataAnnotations.Schema;

using SkbKontur.DbViewer.TestApi.Impl.Attributes;
using SkbKontur.DbViewer.TestApi.Impl.Document;

namespace SkbKontur.DbViewer.TestApi.EntityFramework
{
    public class SqlDocument : IDocument
    {
        [Identity]
        public Guid Id { get; set; }

        public string DocumentNumber { get; set; }
        public DateTimeOffset DocumentDate { get; set; }
        public DocumentType DocumentType { get; set; }
        public bool IsLargeDocument { get; set; }
        public int ShardNumber { get; set; }
        public decimal DocumentPrice { get; set; }

        [Column(TypeName = "jsonb")]
        public DocumentContent DocumentContent { get; set; }
    }
}