using System;
using System.Linq;

using Cassandra;

using GroBuf;

using JetBrains.Annotations;

using SkbKontur.DbViewer.TestApi.Cql;

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
                    DocumentDate = new LocalDate(2000, 10, 11),
                    DocumentTime = new LocalTime(13, 12, 10, 0),
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
    }
}