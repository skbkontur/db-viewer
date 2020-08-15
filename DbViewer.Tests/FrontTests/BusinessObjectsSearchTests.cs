using NUnit.Framework;

using SkbKontur.DbViewer.Tests.FrontTests.Helpers;
using SkbKontur.DbViewer.Tests.FrontTests.Pages;

namespace SkbKontur.DbViewer.Tests.FrontTests
{
    [Ignore("не работает")]
    public class BusinessObjectsSearchTests
    {
        /// <summary>
        ///     Проверяем, что работает поиск на странице бизнес объектов
        ///     Вводим в строке поиска запрос в R# стиле, проверяем ожидаемое количество и название каждого объекта
        /// </summary>
        [Test]
        public void TestSearch()
        {
            using var browser = new BrowserForTests();

            var businessObjectsPage = browser.SwitchTo<BusinessObjectsPage>();
            businessObjectsPage.FilterInput.ClearAndInputText("VCBO");
            businessObjectsPage.ObjectGroups.WaitCount(2);

            var arrayObjects = businessObjectsPage.ObjectGroups.GetItemWithText(x => x.Name.Text, "Business Array Objects");
            arrayObjects.ObjectsList.Wait(x => x.ObjectLink.Text).That(Is.EqualTo(new[]
                {
                    "ValidationsCheckProcessingNowBusinessObject",
                    "RecentValidationsCheckBusinessObject"
                }));

            var objects = businessObjectsPage.ObjectGroups.GetItemWithText(x => x.Name.Text, "Business Objects");
            objects.ObjectsList.Wait(x => x.ObjectLink.Text).That(Is.EqualTo(new[] {"ValidationsCheckBusinessObject"}));
        }

        /// <summary>
        ///     Проверяем, что у таблицы FtpUser есть плашка indexed
        /// </summary>
        [Test]
        public void TestSearchIndexedField()
        {
            using var browser = new BrowserForTests();

            var businessObjects = browser.SwitchTo<BusinessObjectsPage>();
            businessObjects.FilterInput.ClearAndInputText("FtpUserThrift");
            businessObjects.ObjectGroups.WaitCount(1);

            var objects = businessObjects.ObjectGroups.GetItemWithText(x => x.Name.Text, "Business Objects");
            objects.IndexedLabel.WaitPresence();
            objects.ObjectsList.WaitCount(1);
            objects.ObjectsList[0].ObjectLink.WaitText("FtpUserThrift");
        }

        /// <summary>
        ///     Вводим в поиск CqlDocumentPrintingInfo.
        ///     Проверяем что нам выдает ровно одну ссылку
        /// </summary>
        [Test]
        public void TestSearchLink()
        {
            using var browser = new BrowserForTests();

            var businessObjectsPage = browser.SwitchTo<BusinessObjectsPage>();
            businessObjectsPage.FilterInput.ClearAndInputText("CqlDocumentPrintingInfo");
            businessObjectsPage.ObjectGroups.WaitCount(1);
            businessObjectsPage.ObjectGroups[0].ObjectsList.WaitCount(1);
            businessObjectsPage.FindBusinessObjectLink("CQL Objects", "CqlDocumentPrintingInfo").WaitPresence();
        }

        /// <summary>
        ///     Переходим по ссылке на CqlDocumentPrintingInfo
        ///     Проверяем, что ссылка ведет туда, куда нам нужно
        /// </summary>
        [Test]
        public void TestLinkShouldReferToShowTablePage()
        {
            using var browser = new BrowserForTests();

            var businessObjectsPage = browser.SwitchTo<BusinessObjectsPage>();
            var link = businessObjectsPage.FindBusinessObjectLink("CQL Objects", "CqlDocumentPrintingInfo");
            var page = link.ClickAndGoTo<BusinessObjectTablePage>();
            page.Header.WaitText("CqlDocumentPrintingInfo");
        }
    }
}