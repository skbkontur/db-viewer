using System;

using GroBuf;
using GroBuf.DataMembersExtracters;

using SkbKontur.DbViewer.TestApi.Cql;
using SkbKontur.DbViewer.TestApi.EntityFramework;

namespace SkbKontur.DbViewer.TestApi.Impl.Document
{
    public interface IDocument
    {
        public Guid Id { get; }
    }

    public class DocumentModel
    {
        public Guid Id { get; set; }
        public string DocumentNumber { get; set; }
        public DateTimeOffset DocumentDate { get; set; }
        public DocumentType DocumentType { get; set; }
        public bool IsLargeDocument { get; set; }
        public int ShardNumber { get; set; }
        public decimal DocumentPrice { get; set; }
        public DocumentContent DocumentContent { get; set; }
    }

    public static class DocumentExtensions
    {
        public static DocumentModel ToDocumentModel(this IDocument document)
        {
            return document switch
                {
                    CqlDocument cqlDocument => new DocumentModel
                        {
                            Id = cqlDocument.Id,
                            DocumentNumber = cqlDocument.DocumentNumber,
                            DocumentDate = cqlDocument.DocumentDate,
                            DocumentType = cqlDocument.DocumentType,
                            IsLargeDocument = cqlDocument.IsLargeDocument,
                            ShardNumber = cqlDocument.ShardNumber,
                            DocumentPrice = cqlDocument.DocumentPrice,
                            DocumentContent = serializer.Deserialize<DocumentContent>(cqlDocument.DocumentContent),
                        },
                    SqlDocument sqlDocument => new DocumentModel
                        {
                            Id = sqlDocument.Id,
                            DocumentNumber = sqlDocument.DocumentNumber,
                            DocumentDate = sqlDocument.DocumentDate,
                            DocumentType = sqlDocument.DocumentType,
                            IsLargeDocument = sqlDocument.IsLargeDocument,
                            ShardNumber = sqlDocument.ShardNumber,
                            DocumentPrice = sqlDocument.DocumentPrice,
                            DocumentContent = sqlDocument.DocumentContent,
                        },
                    _ => throw new InvalidOperationException()
                };
        }

        public static SqlDocument ToSqlDocument(this DocumentModel documentModel)
        {
            return new SqlDocument
                {
                    Id = documentModel.Id,
                    DocumentNumber = documentModel.DocumentNumber,
                    DocumentDate = documentModel.DocumentDate,
                    DocumentType = documentModel.DocumentType,
                    IsLargeDocument = documentModel.IsLargeDocument,
                    ShardNumber = documentModel.ShardNumber,
                    DocumentPrice = documentModel.DocumentPrice,
                    DocumentContent = documentModel.DocumentContent,
                };
        }

        public static CqlDocument ToCqlDocument(this DocumentModel documentModel)
        {
            return new CqlDocument
                {
                    Id = documentModel.Id,
                    DocumentNumber = documentModel.DocumentNumber,
                    DocumentDate = documentModel.DocumentDate,
                    DocumentType = documentModel.DocumentType,
                    IsLargeDocument = documentModel.IsLargeDocument,
                    ShardNumber = documentModel.ShardNumber,
                    DocumentPrice = documentModel.DocumentPrice,
                    DocumentContent = serializer.Serialize(documentModel.DocumentContent),
                };
        }

        private static readonly ISerializer serializer = new Serializer(new AllPropertiesExtractor());
    }
}