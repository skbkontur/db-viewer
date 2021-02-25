using System;
using System.Linq;

using Cassandra;

using GroBuf;

using JetBrains.Annotations;

using SkbKontur.DbViewer.TestApi.Cql;
using SkbKontur.DbViewer.TestApi.Impl.Document;

namespace SkbKontur.DbViewer.Tests.FrontTests
{
    public static class CqlDocumentsForTests
    {
        [NotNull]
        public static DocumentPrintingInfo GetCqlDocumentPrintingInfo() => new DocumentPrintingInfo
            {
                Id = Guid.NewGuid(),
                PartyId = "PartyId1",
                FileNameWithoutExtension = "fileName1",
                FileExtension = ".ext",
                FileId = "FileId1",
                Status = DocumentPrintingStatus.Finished,
                Timestamp = DateTimeOffset.UtcNow
            };

        [ItemNotNull]
        [NotNull]
        public static DocumentBindingsMeta[] GetCqlDocumentBindingMetaEntries([NotNull] ISerializer serializer)
        {
            var firstPartnersPartyId = Guid.NewGuid().ToString();
            var secondPartnersPartyId = Guid.NewGuid().ToString();

            return Enumerable.Range(0, 5).Select(i => new DocumentBindingsMeta
                {
                    BindingType = DocumentBindingType.ByPriceList,
                    FirstPartnerPartyId = firstPartnersPartyId,
                    SecondPartnerPartyId = secondPartnersPartyId,
                    DocumentNumber = "0",
                    DocumentDate = new LocalDate(2000, 10, 10),
                    DocumentTime = new LocalTime(13, 12, 11, 0),
                    DocumentType = "Invoic",
                    DocumentCirculationId = TimeUuid.NewId(),
                    DocumentWithoutGoodItemsBytes = serializer.Serialize(new Document
                        {
                            ToGln = "123",
                            FromGln = "456",
                            OrdersNumber = "123456",
                        }),
                    EntityMetaBytes = serializer.Serialize(new EntityMeta {BoxId = "123"}),
                }).Union(Enumerable.Range(0, 5).Select(x => new DocumentBindingsMeta
                {
                    BindingType = DocumentBindingType.ByPriceList,
                    FirstPartnerPartyId = firstPartnersPartyId,
                    SecondPartnerPartyId = secondPartnersPartyId,
                    DocumentNumber = "0",
                    DocumentDate = new LocalDate(2000, 10, 10),
                    DocumentTime = new LocalTime(13, 12, 11, 0),
                    DocumentType = "Orders",
                    DocumentCirculationId = TimeUuid.NewId(),
                    DocumentWithoutGoodItemsBytes = serializer.Serialize(new Document
                        {
                            ToGln = "123",
                            FromGln = "456",
                            OrdersNumber = "123456",
                        }),
                    EntityMetaBytes = serializer.Serialize(new EntityMeta {BoxId = "123"}),
                })).ToArray();
        }

        [NotNull]
        public static CqlConnectorDeliveryContext GetCqlConnectorDeliveryContext([NotNull] ISerializer serializer) => new CqlConnectorDeliveryContext
            {
                ContextId = TimeUuid.NewId(),
                TimeSliceId = new DateTimeOffset(2010, 10, 10, 10, 10, 10, 10, TimeSpan.Zero),
                TimeSliceShardNumber = 42,
                ContextContent = serializer.Serialize(new ConnectorDeliveryContext {ContextId = Guid.NewGuid().ToString()}),
            };

        public static DocumentModel GetDocumentModel()
        {
            return new DocumentModel
                {
                    Id = Guid.NewGuid(),
                    DocumentNumber = "123",
                    DocumentDate = new DateTimeOffset(2014, 12, 11, 0, 0, 0, TimeSpan.Zero),
                    DocumentType = DocumentType.Orders,
                    IsLargeDocument = false,
                    ShardNumber = 0,
                    DocumentPrice = 10.1m,
                    DocumentContent = new DocumentContent
                        {
                            OrderStatus = OrderStatus.Processed,
                            WasRead = true,
                            TotalAmount = 10.2m,
                            GoodItems = new[]
                                {
                                    new GoodItem
                                        {
                                            Name = "Name of lintem",
                                            Price = 50,
                                            CustomDeclarationNumbers = new[] {"123/45/6", "7654/6/7"}
                                        },
                                    new GoodItem
                                        {
                                            Name = "Item 2",
                                            Price = 50.1m,
                                            CustomDeclarationNumbers = new[] {"224"}
                                        }
                                }
                        }
                };
        }
    }
}