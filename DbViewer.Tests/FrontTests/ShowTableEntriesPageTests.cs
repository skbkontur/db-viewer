using System;
using System.Linq;

using Cassandra.Data.Linq;

using FluentAssertions;

using GroBuf;
using GroBuf.DataMembersExtracters;

using NUnit.Framework;

using SkbKontur.DbViewer.TestApi.Cql;
using SkbKontur.DbViewer.Tests.FrontTests.Helpers;
using SkbKontur.DbViewer.Tests.FrontTests.Pages;

namespace SkbKontur.DbViewer.Tests.FrontTests
{
    public class ShowTableEntriesPageTests
    {
        /// <summary>
        ///     Не заполняем поле и кликаем найти, должно выдавать ошибку валидации
        ///     Заполняем поле неверным id и нам ничего не находит
        ///     Заполняем поле правильным id и нам выдает 1 запись
        /// </summary>
        [Test]
        public void TestObjectKeysValidation()
        {
            var printingInfo = CqlDocumentsForTests.GetCqlDocumentPrintingInfo();
            var printingInfoId = printingInfo.Id.ToString();

            using (var context = new CqlDbContext())
                context.InsertDocument(printingInfo);

            using var browser = new BrowserForTests();
            var showTableEntriesPage = browser.SwitchTo<BusinessObjectTablePage>("DocumentPrintingInfo");

            showTableEntriesPage.OpenFilter.Click();
            showTableEntriesPage.FilterModal.Apply.Click();
            var searchField = showTableEntriesPage.FilterModal.GetFilter("Id");
            searchField.InputValidation.ExpectIsOpenedWithMessage("Поле должно быть заполнено");
            searchField.Input.ClearAndInputText(Guid.NewGuid().ToString());
            showTableEntriesPage.FilterModal.Apply.Click();

            showTableEntriesPage.BusinessObjectItems.WaitAbsence();
            showTableEntriesPage.NothingFound.WaitPresence();

            showTableEntriesPage.OpenFilter.Click();
            searchField = showTableEntriesPage.FilterModal.GetFilter("Id");
            searchField.Input.ClearAndInputText(printingInfoId);
            showTableEntriesPage.FilterModal.Apply.Click();

            showTableEntriesPage.BusinessObjectItems.WaitCount(1);
            showTableEntriesPage.BusinessObjectItems[0].FindColumn("Id").WaitText(printingInfoId);
        }

        /// <summary>
        ///     В кассандре лежит 10 документов с одинаковыми Partition key, но разными Clustering key
        ///     Первые 5 документов имеют DocumentType Invoic, другие 5 - Orders, у всех разные DocumentCirculationId
        ///     Заполняем часть Partition key, нажимаем найти, должна появится ошибка
        ///     Заполняем все PartitionKey и все Clustering key поля, должен найти 1 документ
        ///     Очищаем поля из ClusteringKey, должен найти 10 докуменов
        ///     Заполняем поле DocumentType значением Invoic, второе оставляем пустым, должен найти первые 5 документов
        ///     Выбираем фильтр по DocumentType '>', должен найти последние 5 документов
        /// </summary>
        [Test]
        public void TestFindDocumentWithClusteringKeyPart()
        {
            var documents = CqlDocumentsForTests.GetCqlDocumentBindingMetaEntries(serializer);
            var firstPartnerPartyId = documents[0].FirstPartnerPartyId;
            var secondPartnerPartyId = documents[0].SecondPartnerPartyId;

            using (var context = new CqlDbContext())
                context.InsertDocuments(documents);

            using var browser = new BrowserForTests();
            var showTableEntriesPage = browser.SwitchTo<BusinessObjectTablePage>("DocumentBindingsMeta");
            showTableEntriesPage.OpenFilter.Click();
            showTableEntriesPage.FilterModal.GetFilter("BindingType").EnumSelect.SelectValueByText("ByPriceList");
            showTableEntriesPage.FilterModal.GetFilter("FirstPartnerPartyId").Input.ClearAndInputText(firstPartnerPartyId);
            showTableEntriesPage.FilterModal.Apply.Click();

            showTableEntriesPage.FilterModal.GetFilter("SecondPartnerPartyId").Input.WaitIncorrect();
            showTableEntriesPage.FilterModal.GetFilter("DocumentNumber").Input.WaitIncorrect();
            showTableEntriesPage.FilterModal.GetFilter("DocumentDate").DateTimeInTicks.WaitIncorrect();
            showTableEntriesPage.FilterModal.GetFilter("DocumentTime").DateTimeInTicks.WaitIncorrect();
            showTableEntriesPage.FilterModal.GetFilter("FirstPartnerPartyId").Input.WaitCorrect();

            showTableEntriesPage.FilterModal.GetFilter("SecondPartnerPartyId").Input.ClearAndInputText(secondPartnerPartyId);
            showTableEntriesPage.FilterModal.GetFilter("DocumentNumber").Input.ClearAndInputText("0");
            showTableEntriesPage.FilterModal.GetFilter("DocumentDate").Date.ClearAndInputText("10.10.2000");
            showTableEntriesPage.FilterModal.GetFilter("DocumentTime").DateTimeInTicks.ClearAndInputText(new DateTime(2020, 10, 10, 13, 12, 11, DateTimeKind.Utc).Ticks.ToString());

            var documentType = documents[0].DocumentType;
            var documentCirculationId = documents[0].DocumentCirculationId.ToString();
            showTableEntriesPage.FilterModal.GetFilter("DocumentType").Input.ClearAndInputText(documentType);
            showTableEntriesPage.FilterModal.GetFilter("DocumentCirculationId").Input.ClearAndInputText(documentCirculationId);

            showTableEntriesPage.FilterModal.Apply.Click();
            showTableEntriesPage.BusinessObjectItems.WaitCount(1);
            showTableEntriesPage.BusinessObjectItems[0].FindColumn("DocumentCirculationId").WaitText(documentCirculationId);

            showTableEntriesPage.OpenFilter.Click();
            showTableEntriesPage.FilterModal.GetFilter("DocumentType").Input.Clear();
            showTableEntriesPage.FilterModal.GetFilter("DocumentCirculationId").Input.Clear();
            showTableEntriesPage.FilterModal.Apply.Click();

            showTableEntriesPage.BusinessObjectItems.WaitCount(10);
            showTableEntriesPage.BusinessObjectItems.Wait(row => row.FindColumn("DocumentCirculationId").Text).That(Is.EquivalentTo(documents.Select(x => x.DocumentCirculationId.ToString())));

            showTableEntriesPage.OpenFilter.Click();
            showTableEntriesPage.FilterModal.GetFilter("DocumentType").Input.ClearAndInputText(documentType);
            showTableEntriesPage.FilterModal.Apply.Click();

            showTableEntriesPage.BusinessObjectItems.WaitCount(5);
            showTableEntriesPage.BusinessObjectItems.Wait(row => row.FindColumn("DocumentType").Text).That(Is.All.EqualTo("Invoic"));

            showTableEntriesPage.OpenFilter.Click();
            showTableEntriesPage.FilterModal.GetFilter("DocumentType").OperatorSelect.SelectValueByText(">");
            showTableEntriesPage.FilterModal.Apply.Click();

            showTableEntriesPage.BusinessObjectItems.WaitCount(5);
            showTableEntriesPage.BusinessObjectItems.Wait(row => row.FindColumn("DocumentType").Text).That(Is.All.EqualTo("Orders"));
        }

        /// <summary>
        ///     Кладем в кассандру 10 документов CqlDocumentBindingMeta с одинаковым PK, но разными CK
        ///     Находим один документ, заполнив PK и CK, удаляем его, проверяем, что осталось 9
        /// </summary>
        [Test]
        public void TestDeleteDocumentWithClusteringKeyPart()
        {
            var documents = CqlDocumentsForTests.GetCqlDocumentBindingMetaEntries(serializer);
            var firstPartnerPartyId = documents[0].FirstPartnerPartyId;
            var secondPartnerPartyId = documents[0].SecondPartnerPartyId;
            var documentType = documents[0].DocumentType;
            var documentCirculationId = documents[0].DocumentCirculationId.ToString();

            using (var context = new CqlDbContext())
                context.InsertDocuments(documents);

            using var browser = new BrowserForTests();
            var showTableEntriesPage = browser.LoginAsSuperUser().SwitchTo<BusinessObjectTablePage>("DocumentBindingsMeta");
            showTableEntriesPage.OpenFilter.Click();
            showTableEntriesPage.FilterModal.GetFilter("BindingType").EnumSelect.SelectValueByText("ByPriceList");
            showTableEntriesPage.FilterModal.GetFilter("FirstPartnerPartyId").Input.ClearAndInputText(firstPartnerPartyId);
            showTableEntriesPage.FilterModal.GetFilter("SecondPartnerPartyId").Input.ClearAndInputText(secondPartnerPartyId);
            showTableEntriesPage.FilterModal.GetFilter("DocumentNumber").Input.ClearAndInputText("0");
            showTableEntriesPage.FilterModal.GetFilter("DocumentDate").Date.ClearAndInputText("10.10.2000");
            showTableEntriesPage.FilterModal.GetFilter("DocumentTime").DateTimeInTicks.ClearAndInputText(new DateTime(2020, 10, 10, 13, 12, 11, DateTimeKind.Utc).Ticks.ToString());
            showTableEntriesPage.FilterModal.GetFilter("DocumentType").Input.ClearAndInputText(documentType);
            showTableEntriesPage.FilterModal.GetFilter("DocumentCirculationId").Input.ClearAndInputText(documentCirculationId);
            showTableEntriesPage.FilterModal.Apply.Click();
            showTableEntriesPage.BusinessObjectItems.WaitCount(1);
            showTableEntriesPage.BusinessObjectItems[0].FindColumn("DocumentCirculationId").WaitText(documentCirculationId);
            showTableEntriesPage.BusinessObjectItems[0].Delete.Click();
            showTableEntriesPage.ConfirmDeleteObjectModal.Delete.Click();

            showTableEntriesPage = browser.RefreshUntil(showTableEntriesPage, x => x.NothingFound.IsPresent.Get());
            showTableEntriesPage.OpenFilter.Click();
            showTableEntriesPage.FilterModal.GetFilter("DocumentType").Input.Clear();
            showTableEntriesPage.FilterModal.GetFilter("DocumentCirculationId").Input.Clear();
            showTableEntriesPage.FilterModal.Apply.Click();
            showTableEntriesPage.BusinessObjectItems.WaitCount(9);

            GetBindingMeta(documents[0]).Length.Should().Be(0);
        }

        /// <summary>
        ///     Проверяем сортировку и пейджинг
        /// </summary>
        [Test]
        public void TestSortDocuments()
        {
            var id = Guid.NewGuid().ToString();
            var documents = Enumerable.Range(0, 100)
                                      .Select(x => new CqlActiveBoxState {PartitionKey = id, BoxId = Guid.NewGuid()})
                                      .ToArray();

            using (var context = new CqlDbContext())
                context.InsertDocuments(documents);

            using var browser = new BrowserForTests();
            var showTableEntriesPage = browser.SwitchTo<BusinessObjectTablePage>("CqlActiveBoxState");
            showTableEntriesPage.OpenFilter.Click();
            showTableEntriesPage.FilterModal.GetFilter("PartitionKey").Input.ClearAndInputText(id);
            showTableEntriesPage.FilterModal.Apply.Click();

            showTableEntriesPage.TableHeader.SortByColumn("Header_BoxId");
            showTableEntriesPage.TableHeader.SortByColumn("Header_BoxId");
            showTableEntriesPage.BusinessObjectItems.Wait(x => x.FindColumn("BoxId").Text).That(Is.EqualTo(GetBoxIds(documents)));

            showTableEntriesPage.Paging.GoToNextPage();
            showTableEntriesPage.BusinessObjectItems.Wait(x => x.FindColumn("BoxId").Text).That(Is.EqualTo(GetBoxIds(documents, skip : 20)));
            showTableEntriesPage.Paging.PagesCount.Wait().That(Is.EqualTo(5));

            showTableEntriesPage.CountDropdown.CurrentCount.Click();
            showTableEntriesPage.CountDropdown.Menu.GetItemByUniqueTid("##50Items").Click();
            showTableEntriesPage.BusinessObjectItems.Wait(x => x.FindColumn("BoxId").Text).That(Is.EqualTo(GetBoxIds(documents, take : 50)));
            showTableEntriesPage.Paging.PagesCount.Wait().That(Is.EqualTo(2));

            showTableEntriesPage.CountDropdown.CurrentCount.Click();
            showTableEntriesPage.CountDropdown.Menu.GetItemByUniqueTid("##100Items").Click();
            showTableEntriesPage.BusinessObjectItems.Wait(x => x.FindColumn("BoxId").Text).That(Is.EqualTo(GetBoxIds(documents, take : 100)));
            showTableEntriesPage.Paging.WaitAbsence();
        }

        /// <summary>
        ///     Заполняем страницу BlobStorageSlice: SliceId - DateTimeOffset,  SliceShardNumber - sbyte, BlobId - TimeUuid
        ///     Должен найти 1 документ
        ///     Проверяем, что можем удалить документ
        /// </summary>
        [Test]
        public void TestFindDocumentWithDifferentColumnTypes()
        {
            var document = CqlDocumentsForTests.GetCqlConnectorDeliveryContext(serializer);
            var document2 = CqlDocumentsForTests.GetCqlConnectorDeliveryContext(serializer);

            using (var context = new CqlDbContext())
                context.InsertDocuments(new[] {document, document2});

            using var browser = new BrowserForTests();
            var showTableEntriesPage = browser.LoginAsSuperUser().SwitchTo<BusinessObjectTablePage>("CqlConnectorDeliveryContext");
            showTableEntriesPage.OpenFilter.Click();
            showTableEntriesPage.FilterModal.GetFilter("TimeSliceId").DateTimeInTicks.ClearAndInputText(document.TimeSliceId.UtcTicks.ToString());
            showTableEntriesPage.FilterModal.GetFilter("TimeSliceShardNumber").Input.ClearAndInputText(document.TimeSliceShardNumber.ToString());
            showTableEntriesPage.FilterModal.GetFilter("ContextId").Input.ClearAndInputText(document.ContextId.ToString());
            showTableEntriesPage.FilterModal.Apply.Click();

            showTableEntriesPage.BusinessObjectItems.WaitCount(1);
            var row = showTableEntriesPage.BusinessObjectItems[0];
            row.FindColumn("TimeSliceId").WaitText(document.TimeSliceId.ToString("yyyy-MM-ddTHH:mm:ss.ffK"));
            row.FindColumn("TimeSliceShardNumber").WaitText(document.TimeSliceShardNumber.ToString());
            row.FindColumn("ContextId").WaitText(document.ContextId.ToString());

            row.Delete.Click();
            showTableEntriesPage.ConfirmDeleteObjectModal.Delete.Click();
            browser.RefreshUntil(showTableEntriesPage, x => x.NothingFound.IsPresent.Get());

            GetConnectorDeliveryContext(document).Length.Should().Be(0);
            GetConnectorDeliveryContext(document2).Single().Should().BeEquivalentTo(document2);
        }

        private CqlConnectorDeliveryContext[] GetConnectorDeliveryContext(CqlConnectorDeliveryContext deliveryContext)
        {
            using var context = new CqlDbContext();
            return context.GetTable<CqlConnectorDeliveryContext>()
                          .Where(x => x.TimeSliceId == deliveryContext.TimeSliceId
                                      && x.TimeSliceShardNumber == deliveryContext.TimeSliceShardNumber
                                      && x.ContextId == deliveryContext.ContextId)
                          .Execute()
                          .ToArray();
        }

        private DocumentBindingsMeta[] GetBindingMeta(DocumentBindingsMeta meta)
        {
            using var context = new CqlDbContext();
            return context.GetTable<DocumentBindingsMeta>()
                          .Where(x => x.BindingType == meta.BindingType
                                      && x.FirstPartnerPartyId == meta.FirstPartnerPartyId
                                      && x.SecondPartnerPartyId == meta.SecondPartnerPartyId
                                      && x.DocumentNumber == meta.DocumentNumber
                                      && x.DocumentDate == meta.DocumentDate
                                      && x.DocumentTime == meta.DocumentTime
                                      && x.DocumentType == meta.DocumentType
                                      && x.DocumentCirculationId == meta.DocumentCirculationId)
                          .Execute()
                          .ToArray();
        }

        private static string[] GetBoxIds(CqlActiveBoxState[] documents, int skip = 0, int take = 20)
        {
            return documents.Select(x => x.BoxId.ToString()).OrderByDescending(x => x).Skip(skip).Take(take).ToArray();
        }

        private readonly ISerializer serializer = new Serializer(new AllPropertiesExtractor());
    }
}