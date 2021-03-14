using System;

using NUnit.Framework;

using SkbKontur.DbViewer.TestApi.Cql;
using SkbKontur.DbViewer.Tests.FrontTests.Helpers;
using SkbKontur.DbViewer.Tests.FrontTests.Pages;

namespace SkbKontur.DbViewer.Tests.FrontTests
{
    public class BusinessObjectsSearchNonIndexedTest
    {
        /// <summary>
        ///     Проверяем, что валидации на некорректные символы и пустые строки в модалке работают
        /// </summary>
        [Test]
        public void TestValidation()
        {
            using var browser = new BrowserForTests();

            var businessObjectsPage = browser.SwitchTo<BusinessObjectsPage>();
            businessObjectsPage.FilterInput.ClearAndInputText("ApiClientThrift");
            businessObjectsPage.ObjectGroups.Wait(x => x.Name.Text).That(Is.EqualTo(new[] {"Business Array Objects"}));
            businessObjectsPage.ObjectGroups[0].ObjectsList.WaitCount(1);
            var link = businessObjectsPage.ObjectGroups[0].ObjectsList.GetItemWithText(x => x.Text, "ApiClientThrift");
            var searchPage = link.ObjectLink.ClickAndGoTo<BusinessObjectTablePage>();

            searchPage.Header.WaitText("ApiClientThrift");
            var id = searchPage.FilterModal.GetFilter("Id");
            var scopeId = searchPage.FilterModal.GetFilter("ScopeId");
            var arrayIndex = searchPage.FilterModal.GetFilter("ArrayIndex");

            id.Input.ClearAndInputText("123");
            scopeId.Input.ClearAndInputText("123");

            searchPage.FilterModal.Apply.Click();
            arrayIndex.InputValidation.ExpectIsOpenedWithMessage("Поле должно быть заполнено");

            arrayIndex.Input.ClearAndInputText("    ");
            searchPage.FilterModal.Apply.Click();
            arrayIndex.InputValidation.ExpectIsOpenedWithMessage("Поле должно быть заполнено");

            arrayIndex.Input.ClearAndInputText("<script>");
            searchPage.FilterModal.Apply.Click();
            arrayIndex.InputValidation.ExpectIsOpenedWithMessage("Некорректный символ: '<'");

            arrayIndex.Input.ClearAndInputText("123");

            scopeId.Input.ClearAndInputText("    ");
            searchPage.FilterModal.Apply.Click();
            scopeId.InputValidation.ExpectIsOpenedWithMessage("Поле должно быть заполнено");

            scopeId.Input.ClearAndInputText(">##");
            searchPage.FilterModal.Apply.Click();
            scopeId.InputValidation.ExpectIsOpenedWithMessage("Некорректный символ: '>'");

            scopeId.Input.ClearAndInputText("123");

            id.Input.Clear();
            searchPage.FilterModal.Apply.Click();
            id.InputValidation.ExpectIsOpenedWithMessage("Поле должно быть заполнено");

            id.Input.ClearAndInputText("&##");
            searchPage.FilterModal.Apply.Click();
            id.InputValidation.ExpectIsOpenedWithMessage("Некорректный символ: '&'");
        }

        /// <summary>
        ///     Проверяем, что не индексированные объекты находятся
        /// </summary>
        [Test]
        public void TestFindObject()
        {
            var objectId = Guid.NewGuid().ToString("D");
            var lastEventId = Guid.NewGuid().ToString("D");
            CreateApiClient(objectId, lastEventId);

            using var browser = new BrowserForTests();

            var searchPage = browser.SwitchTo<BusinessObjectTablePage>("ApiClientThrift");
            searchPage.FilterModal.GetFilter("Id").Input.ClearAndInputText(objectId);
            searchPage.FilterModal.GetFilter("ScopeId").Input.ClearAndInputText("scopeId");
            searchPage.FilterModal.GetFilter("ArrayIndex").Input.ClearAndInputText("arrayIndex");
            searchPage.FilterModal.Apply.Click();
            searchPage.BusinessObjectItems.WaitCount(1);

            var detailsPage = searchPage.BusinessObjectItems[0].Details.ClickAndGoTo<BusinessObjectDetailsPage>();
            detailsPage.RootAccordion.FindField("Id").FieldValue.WaitText(objectId);
            detailsPage.RootAccordion.FindField("ScopeId").FieldValue.WaitText("scopeId");
            detailsPage.RootAccordion.FindField("ArrayIndex").FieldValue.WaitText("arrayIndex");
            detailsPage.RootAccordion.FindField("Description").FieldValue.WaitText(lastEventId);
        }

        /// <summary>
        ///     Проверяем, что при попытке поискать несуществующий объект нас перекидывает на 404
        /// </summary>
        [Test]
        public void TestObjectNotFound()
        {
            using var browser = new BrowserForTests();

            var searchPage = browser.SwitchTo<BusinessObjectTablePage>("ApiClientThrift");
            searchPage.Header.WaitText("ApiClientThrift");
            searchPage.FilterModal.GetFilter("Id").Input.ClearAndInputText("123");
            searchPage.FilterModal.GetFilter("ScopeId").Input.ClearAndInputText("123");
            searchPage.FilterModal.GetFilter("ArrayIndex").Input.ClearAndInputText("123");
            searchPage.FilterModal.Apply.Click();

            searchPage.NothingFound.WaitPresence();
            searchPage.BusinessObjectItems.WaitAbsence();
        }

        private static void CreateApiClient(string objectId, string lastEventId)
        {
            using var context = new CqlDbContext();
            var table = context.GetTable<ApiClientThrift>();
            table.Insert(new ApiClientThrift
                {
                    Id = objectId,
                    ScopeId = "scopeId",
                    ArrayIndex = "arrayIndex",
                    Description = lastEventId,
                }).SetTimestamp(DateTimeOffset.UtcNow).Execute();
        }
    }
}