using System;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

using FluentAssertions;

using NUnit.Framework;

using SkbKontur.DbViewer.TestApi.Cql;
using SkbKontur.DbViewer.Tests.FrontTests.Pages;
using SkbKontur.DbViewer.Tests.FrontTests.Playwright;

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
        public async Task TestSuperUserCanEditOrDeleteObject()
        {
            var document = CqlDocumentsForTests.GetCqlDocumentPrintingInfo();
            using (var context = new CqlDbContext())
                context.GetTable<DocumentPrintingInfo>().Insert(document).SetTimestamp(DateTimeOffset.UtcNow).Execute();

            await using var browser = new Browser();
            var printingInfoPage = await (await browser.LoginAsSuperUser()).SwitchTo<PwBusinessObjectTablePage>("DocumentPrintingInfo");
            await printingInfoPage.OpenFilter.Click();
            await (await printingInfoPage.FilterModal.GetFilter("Id")).Input.ClearAndInputText(document.Id.ToString());
            await printingInfoPage.FilterModal.Apply.Click();

            var detailsPage = await printingInfoPage.BusinessObjectItems[0].Details.ClickAndGoTo<PwBusinessObjectDetailsPage>();

            var id = detailsPage.RootAccordion.FindField("Id");
            await id.Edit.WaitAbsence();

            var partyId = detailsPage.RootAccordion.FindField("PartyId");
            await partyId.Edit.WaitAbsence();

            var fileId = detailsPage.RootAccordion.FindField("FileId");
            await fileId.Edit.Click();
            await fileId.FieldValue.Input.ClearAndInputText("Abc");
            await fileId.Save.Click();
            await fileId.Value.WaitText("Abc");

            var status = detailsPage.RootAccordion.FindField("Status");
            await status.Edit.Click();
            await status.FieldValue.EnumSelect.WaitText("Finished");
            await status.FieldValue.EnumSelect.WaitItems(new[] {"Unknown", "Pending", "Failed", "Finished"});
            await status.FieldValue.EnumSelect.SelectValueByText("Failed");
            await status.Save.Click();
            await status.Value.WaitText("Failed");

            var timestamp = detailsPage.RootAccordion.FindField("Timestamp");
            await timestamp.Edit.Click();
            await timestamp.FieldValue.Date.ClearAndInputText("13.12.2013");
            await timestamp.Save.Click();
            await timestamp.Value.Expect().ToHaveTextAsync(new Regex("^2013-12-13T.*"));

            document.FileId = "Abc";
            document.Status = DocumentPrintingStatus.Failed;

            detailsPage = await browser.Refresh(detailsPage);
            await CheckDocumentPrintingInfoFields(detailsPage, document);

            await detailsPage.Delete.Click();
            printingInfoPage = await detailsPage.ConfirmDeleteObjectModal.Delete.ClickAndGoTo<PwBusinessObjectTablePage>();
            await printingInfoPage.OpenFilter.Click();
            await (await printingInfoPage.FilterModal.GetFilter("Id")).Input.ClearAndInputText(document.Id.ToString());
            await printingInfoPage.FilterModal.Apply.Click();
            await printingInfoPage.NothingFound.WaitPresence();
            await printingInfoPage.BusinessObjectItems.WaitAbsence();
        }

        /// <summary>
        ///     Заходим на страницу подробного описания объекта с правами разработчика, не видим кнопок изменить и удалить
        /// </summary>
        [Test]
        public async Task TestNonSuperUserCantEditOrDeleteObject()
        {
            var document = CqlDocumentsForTests.GetCqlDocumentPrintingInfo();
            using (var context = new CqlDbContext())
                context.GetTable<DocumentPrintingInfo>().Insert(document).SetTimestamp(DateTimeOffset.UtcNow).Execute();

            await using var browser = new Browser();
            var printingInfoPage = await browser.SwitchTo<PwBusinessObjectTablePage>("DocumentPrintingInfo");
            await printingInfoPage.OpenFilter.Click();
            await (await printingInfoPage.FilterModal.GetFilter("Id")).Input.ClearAndInputText(document.Id.ToString());
            await printingInfoPage.FilterModal.Apply.Click();

            var detailsPage = await printingInfoPage.BusinessObjectItems[0].Details.ClickAndGoTo<PwBusinessObjectDetailsPage>();
            await detailsPage.RootAccordion.FindField("PartyId").Edit.WaitAbsence();
            await detailsPage.Delete.WaitAbsence();
        }

        /// <summary>
        ///     Переходим на страницу поиска элементов в таблице CqlDocumentPrintingInfo заполняем поля
        ///     Должен найти объект, ссылка должна вести на подробное описание объекта
        /// </summary>
        [Test]
        public async Task TestLinkFromFindShouldReferToDetailPage()
        {
            var document = CqlDocumentsForTests.GetCqlDocumentPrintingInfo();
            using (var context = new CqlDbContext())
                context.GetTable<DocumentPrintingInfo>().Insert(document).SetTimestamp(DateTimeOffset.UtcNow).Execute();

            await using var browser = new Browser();
            var printingInfoPage = await (await browser.LoginAsSuperUser()).SwitchTo<PwBusinessObjectTablePage>("DocumentPrintingInfo");
            await printingInfoPage.BusinessObjectItems.Expect().Not.ToHaveCountAsync(0);
            await printingInfoPage.OpenFilter.Click();
            await (await printingInfoPage.FilterModal.GetFilter("Id")).Input.ClearAndInputText(document.Id.ToString());
            await printingInfoPage.FilterModal.Apply.Click();

            await printingInfoPage.BusinessObjectItems.WaitCount(1);
            await printingInfoPage.BusinessObjectItems[0].FindColumn("Id").WaitText(document.Id.ToString());
            var detailsPage = await printingInfoPage.BusinessObjectItems[0].Details.ClickAndGoTo<PwBusinessObjectDetailsPage>();
            await detailsPage.Header.WaitPresence();

            await CheckDocumentPrintingInfoFields(detailsPage, document);
        }

        /// <summary>
        ///     Переходим на страницу TempFileStorageTable, вводим BlobId, находим документ, переходим на подробное описание
        ///     В строке Content должна быть ссылка скачать. Проверяем, что при нажатии скачиваются правильные байты
        /// </summary>
        [Test]
        public async Task TestDownloadByteContent()
        {
            var content = string.Join("\n", new[] {"this is large file content"}.Concat(Enumerable.Range(0, 10000).Select(i => (i % 256).ToString())));
            var blobId = Guid.NewGuid();
            using (var context = new CqlDbContext())
                await context.GetTable<CqlActiveBoxState>().Insert(new CqlActiveBoxState
                    {
                        PartitionKey = "0",
                        LastProcessedEventId = "0",
                        BoxId = blobId,
                        Content = Encoding.UTF8.GetBytes(content),
                    }).SetTimestamp(DateTimeOffset.UtcNow).ExecuteAsync();

            await using var browser = new Browser();

            var tempFileStoragePage = await (await browser.LoginAsSuperUser()).SwitchTo<PwBusinessObjectTablePage>("CqlActiveBoxState");
            await tempFileStoragePage.OpenFilter.Click();
            await (await tempFileStoragePage.FilterModal.GetFilter("PartitionKey")).Input.ClearAndInputText("0");
            await (await tempFileStoragePage.FilterModal.GetFilter("BoxId")).Input.ClearAndInputText(blobId.ToString());
            await tempFileStoragePage.FilterModal.Apply.Click();
            await tempFileStoragePage.BusinessObjectItems.WaitCount(1);

            var detailsPage = await tempFileStoragePage.BusinessObjectItems[0].Details.ClickAndGoTo<PwBusinessObjectDetailsPage>();

            var waitForDownloadTask = tempFileStoragePage.Page.WaitForDownloadAsync();
            await detailsPage.RootAccordion.FindField("Content").FieldValue.DownloadLink.Click();
            var download = await waitForDownloadTask;

            download.SuggestedFilename.Should().Be("CqlActiveBoxState-Content-dGhpcy.bin");

            var filename = $"{TestContext.CurrentContext.TestDirectory}/Files/{download.SuggestedFilename}";
            await download.SaveAsAsync(filename);
            (await File.ReadAllTextAsync(filename)).Should().Be(content);
        }

        private static async Task CheckDocumentPrintingInfoFields(PwBusinessObjectDetailsPage page, DocumentPrintingInfo document)
        {
            await page.RootAccordion.FindField("Id").Value.WaitText(document.Id.ToString());
            await page.RootAccordion.FindField("PartyId").Value.WaitText(document.PartyId);
            await page.RootAccordion.FindField("FileNameWithoutExtension").Value.WaitText(document.FileNameWithoutExtension);
            await page.RootAccordion.FindField("FileExtension").Value.WaitText(document.FileExtension);
            await page.RootAccordion.FindField("FileId").Value.WaitText(document.FileId);
            await page.RootAccordion.FindField("Status").Value.WaitText(document.Status.ToString());
        }
    }
}