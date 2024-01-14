using System.Threading.Tasks;

using NUnit.Framework;

using SkbKontur.DbViewer.Tests.FrontTests.Pages;
using SkbKontur.DbViewer.Tests.FrontTests.Playwright;

namespace SkbKontur.DbViewer.Tests.FrontTests
{
    public class BusinessObjectsSearchTests
    {
        /// <summary>
        ///     Проверяем, что работает поиск на странице бизнес объектов
        ///     Вводим в строке поиска запрос в R# стиле, проверяем ожидаемое количество и название каждого объекта
        /// </summary>
        [Test]
        public async Task TestSearch()
        {
            await using var browser = new Browser();

            var businessObjectsPage = await browser.SwitchTo<PwBusinessObjectsPage>();
            await businessObjectsPage.FilterInput.ClearAndInputText("CI");
            await businessObjectsPage.ObjectGroups.WaitCount(1);

            var pagedObjects = await businessObjectsPage.ObjectGroups.GetItemWithText(x => x.Name, "CQL Paged Objects");
            await pagedObjects.ObjectsList
                              .Select(x => x.ObjectLink)
                              .WaitText("CqlOrganizationInfo", "CqlUserInfo");

            await businessObjectsPage.FilterInput.ClearAndInputText("DocMe");
            await businessObjectsPage.ObjectGroups.WaitCount(2);

            var cqlObjects = await businessObjectsPage.ObjectGroups.GetItemWithText(x => x.Name, "CQL Objects");
            await cqlObjects.ObjectsList
                            .Select(x => x.ObjectLink)
                            .WaitText(new[] {"DocumentBindingsMeta"});

            var cqlPagedObjects = await businessObjectsPage.ObjectGroups.GetItemWithText(x => x.Name, "CQL Paged Objects");
            await cqlPagedObjects.ObjectsList
                                 .Select(x => x.ObjectLink)
                                 .WaitText(new[] {"CqlDocumentMeta"});
        }

        /// <summary>
        ///     Проверяем, что у таблицы FtpUser есть плашка indexed
        /// </summary>
        [Test]
        public async Task TestSearchIndexedField()
        {
            await using var browser = new Browser();

            var businessObjects = await browser.SwitchTo<PwBusinessObjectsPage>();
            await businessObjects.FilterInput.ClearAndInputText("UsersTable");
            await businessObjects.ObjectGroups.WaitCount(1);

            var objects = await businessObjects.ObjectGroups.GetItemWithText(x => x.Name, "Postgres Objects");
            await objects.IndexedLabel.WaitPresence();
            await objects.ObjectsList.WaitCount(1);
            await objects.ObjectsList[0].ObjectLink.WaitText("UsersTable");
        }

        /// <summary>
        ///     Вводим в поиск CqlDocumentPrintingInfo.
        ///     Проверяем что нам выдает ровно одну ссылку
        /// </summary>
        [Test]
        public async Task TestSearchLink()
        {
            await using var browser = new Browser();

            var businessObjectsPage = await browser.SwitchTo<PwBusinessObjectsPage>();
            await businessObjectsPage.FilterInput.ClearAndInputText("DocumentPrintingInfo");
            await businessObjectsPage.ObjectGroups.WaitCount(1);
            await businessObjectsPage.ObjectGroups[0].ObjectsList.WaitCount(1);
            await businessObjectsPage.FindBusinessObjectLink("CQL Objects", "DocumentPrintingInfo");
        }

        /// <summary>
        ///     Переходим по ссылке на CqlDocumentPrintingInfo
        ///     Проверяем, что ссылка ведет туда, куда нам нужно
        /// </summary>
        [Test]
        public async Task TestLinkShouldReferToShowTablePage()
        {
            await using var browser = new Browser();

            var businessObjectsPage = await browser.SwitchTo<PwBusinessObjectsPage>();
            var link = await businessObjectsPage.FindBusinessObjectLink("CQL Objects", "DocumentPrintingInfo");
            var page = await link.ClickAndGoTo<PwBusinessObjectTablePage>();
            await page.Header.WaitText("DocumentPrintingInfo");
        }
    }
}