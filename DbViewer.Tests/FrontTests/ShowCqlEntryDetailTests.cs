using System;
using System.Linq;
using System.Text;
using System.Threading;

using FluentAssertions;

using JetBrains.Annotations;

using NUnit.Framework;

using SkbKontur.DbViewer.TestApi.Cql;
using SkbKontur.DbViewer.Tests.FrontTests.Helpers;
using SkbKontur.DbViewer.Tests.FrontTests.Pages;

namespace SkbKontur.DbViewer.Tests.FrontTests
{
    public class ShowCqlEntryDetailTest
    {
        /// <summary>
        ///     Заходим от админа, проверяем, что изменять значение в ключе нельзя,
        ///     изменяем значение не в ключе, проверяем, что значение изменено
        ///     Изменяем значение типа enum, проверяем, что все значения энума можно указать
        ///     Изменяем значение типа DateTime, проверяем корректное сохранение (проверяем только дату, так как время переводится в utc)
        ///     Удаляем объект, пытаемся в таблице снова поискать его по Id - не находим
        /// </summary>
        [Test]
        public void TestSuperUserCanEditOrDeleteObject()
        {
            var document = CqlDocumentsForTests.GetCqlDocumentPrintingInfo();
            using (var context = new CqlDbContext())
                context.GetTable<DocumentPrintingInfo>().Insert(document).SetTimestamp(DateTimeOffset.UtcNow).Execute();

            using var browser = new BrowserForTests();
            var printingInfoPage = browser.LoginAsSuperUser().SwitchTo<BusinessObjectTablePage>("DocumentPrintingInfo");
            printingInfoPage.OpenFilter.Click();
            printingInfoPage.FilterModal.GetFilter("Id").Input.ClearAndInputText(document.Id.ToString());
            printingInfoPage.FilterModal.Apply.Click();

            var detailsPage = printingInfoPage.BusinessObjectItems[0].Details.ClickAndGoTo<BusinessObjectDetailsPage>();

            var id = detailsPage.RootAccordion.FindField("Id");
            id.Edit.WaitAbsence();

            var partyId = detailsPage.RootAccordion.FindField("PartyId");
            partyId.Edit.WaitAbsence();

            var fileId = detailsPage.RootAccordion.FindField("FileId");
            fileId.Edit.Click();
            fileId.FieldValue.Input.ClearAndInputText("Abc");
            fileId.Save.Click();
            fileId.Value.WaitText("Abc");

            var status = detailsPage.RootAccordion.FindField("Status");
            status.Edit.Click();
            status.FieldValue.EnumSelect.WaitText("Finished");
            status.FieldValue.EnumSelect.WaitItems(new[] {"Unknown", "Pending", "Failed", "Finished"});
            status.FieldValue.EnumSelect.SelectValueByText("Failed");
            status.Save.Click();
            status.Value.WaitText("Failed");

            var timestamp = detailsPage.RootAccordion.FindField("Timestamp");
            timestamp.Edit.Click();
            timestamp.FieldValue.Date.ClearAndInputText("13.12.2013");
            timestamp.Save.Click();
            timestamp.Value.Text.Wait().That(Does.StartWith("2013-12-13"));

            document.FileId = "Abc";
            document.Status = DocumentPrintingStatus.Failed;

            detailsPage = browser.Refresh(detailsPage);
            CheckDocumentPrintingInfoFields(detailsPage, document);

            detailsPage.Delete.Click();
            printingInfoPage = detailsPage.ConfirmDeleteObjectModal.Delete.ClickAndGoTo<BusinessObjectTablePage>();
            printingInfoPage.OpenFilter.Click();
            printingInfoPage.FilterModal.GetFilter("Id").Input.ClearAndInputText(document.Id.ToString());
            printingInfoPage.FilterModal.Apply.Click();
            printingInfoPage.NothingFound.WaitPresence();
            printingInfoPage.BusinessObjectItems.WaitAbsence();
        }

        /// <summary>
        ///     Заходим на страницу подробного описания объекта с правами разработчика, не видим кнопок изменить и удалить
        /// </summary>
        [Test]
        public void TestNonSuperUserCantEditOrDeleteObject()
        {
            var document = CqlDocumentsForTests.GetCqlDocumentPrintingInfo();
            using (var context = new CqlDbContext())
                context.GetTable<DocumentPrintingInfo>().Insert(document).SetTimestamp(DateTimeOffset.UtcNow).Execute();

            using var browser = new BrowserForTests();
            var printingInfoPage = browser.SwitchTo<BusinessObjectTablePage>("DocumentPrintingInfo");
            printingInfoPage.OpenFilter.Click();
            printingInfoPage.FilterModal.GetFilter("Id").Input.ClearAndInputText(document.Id.ToString());
            printingInfoPage.FilterModal.Apply.Click();

            var detailsPage = printingInfoPage.BusinessObjectItems[0].Details.ClickAndGoTo<BusinessObjectDetailsPage>();
            detailsPage.RootAccordion.FindField("PartyId").Edit.WaitAbsence();
            detailsPage.Delete.WaitAbsence();
        }

        /// <summary>
        ///     Переходим на страницу поиска элементов в таблице CqlDocumentPrintingInfo заполняем поля
        ///     Должен найти объект, ссылка должна вести на подробное описание объекта
        /// </summary>
        [Test]
        public void TestLinkFromFindShouldReferToDetailPage()
        {
            var document = CqlDocumentsForTests.GetCqlDocumentPrintingInfo();
            using (var context = new CqlDbContext())
                context.GetTable<DocumentPrintingInfo>().Insert(document).SetTimestamp(DateTimeOffset.UtcNow).Execute();

            using var browser = new BrowserForTests();
            var printingInfoPage = browser.LoginAsSuperUser().SwitchTo<BusinessObjectTablePage>("DocumentPrintingInfo");
            printingInfoPage.BusinessObjectItems.Count.Wait().That(Is.GreaterThan(0));
            printingInfoPage.OpenFilter.Click();
            printingInfoPage.FilterModal.GetFilter("Id").Input.ClearAndInputText(document.Id.ToString());
            printingInfoPage.FilterModal.Apply.Click();

            printingInfoPage.BusinessObjectItems.WaitCount(1);
            printingInfoPage.BusinessObjectItems[0].FindColumn("Id").WaitText(document.Id.ToString());
            var detailsPage = printingInfoPage.BusinessObjectItems[0].Details.ClickAndGoTo<BusinessObjectDetailsPage>();
            detailsPage.Header.WaitPresence();

            CheckDocumentPrintingInfoFields(detailsPage, document);
        }

        /// <summary>
        ///     Переходим на страницу TempFileStorageTable, вводим BlobId, находим документ, переходим на подробное описание
        ///     В строке Content должна быть ссылка скачать. Проверяем, что при нажатии скачиваются правильные байты
        /// </summary>
        [Test]
        public void TestDownloadByteContent()
        {
            var content = string.Join("\n", new[] {"this is large file content"}.Concat(Enumerable.Range(0, 10000).Select(i => (i % 256).ToString())));
            var blobId = Guid.NewGuid();
            using (var context = new CqlDbContext())
                context.GetTable<CqlActiveBoxState>().Insert(new CqlActiveBoxState
                    {
                        PartitionKey = "0",
                        LastProcessedEventId = "0",
                        BoxId = blobId,
                        Content = Encoding.UTF8.GetBytes(content),
                    }).SetTimestamp(DateTimeOffset.UtcNow).Execute();

            using var browser = new BrowserForTests();

            var tempFileStoragePage = browser.LoginAsSuperUser().SwitchTo<BusinessObjectTablePage>("CqlActiveBoxState");
            tempFileStoragePage.OpenFilter.Click();
            tempFileStoragePage.FilterModal.GetFilter("PartitionKey").Input.ClearAndInputText("0");
            tempFileStoragePage.FilterModal.GetFilter("BoxId").Input.ClearAndInputText(blobId.ToString());
            tempFileStoragePage.FilterModal.Apply.Click();
            tempFileStoragePage.BusinessObjectItems.WaitCount(1);

            var detailsPage = tempFileStoragePage.BusinessObjectItems[0].Details.ClickAndGoTo<BusinessObjectDetailsPage>();
            detailsPage.RootAccordion.FindField("Content").FieldValue.DownloadLink.Click();

            Thread.Sleep(1000);
            var file = browser.DownloadFile("CqlActiveBoxState-Content-dGhpcy.bin");
            file.Should().Be(content);
        }

        private static void CheckDocumentPrintingInfoFields([NotNull] BusinessObjectDetailsPage page, [NotNull] DocumentPrintingInfo document)
        {
            page.RootAccordion.FindField("Id").Value.WaitText(document.Id.ToString());
            page.RootAccordion.FindField("PartyId").Value.WaitText(document.PartyId);
            page.RootAccordion.FindField("FileNameWithoutExtension").Value.WaitText(document.FileNameWithoutExtension);
            page.RootAccordion.FindField("FileExtension").Value.WaitText(document.FileExtension);
            page.RootAccordion.FindField("FileId").Value.WaitText(document.FileId);
            page.RootAccordion.FindField("Status").Value.WaitText(document.Status.ToString());
        }
    }
}