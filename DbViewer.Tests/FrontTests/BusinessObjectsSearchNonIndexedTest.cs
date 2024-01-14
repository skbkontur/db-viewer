using System;
using System.Threading.Tasks;

using NUnit.Framework;

using SkbKontur.DbViewer.TestApi.Cql;
using SkbKontur.DbViewer.Tests.FrontTests.Pages;
using SkbKontur.DbViewer.Tests.FrontTests.Playwright;

namespace SkbKontur.DbViewer.Tests.FrontTests
{
    public class BusinessObjectsSearchNonIndexedTest
    {
        /// <summary>
        ///     Проверяем, что валидации на некорректные символы и пустые строки в модалке работают
        /// </summary>
        [Test]
        public async Task TestValidation()
        {
            await using var browser = new Browser();

            var businessObjectsPage = await browser.SwitchTo<PwBusinessObjectsPage>();
            await businessObjectsPage.FilterInput.ClearAndInputText("ApiClientThrift");
            await (await businessObjectsPage.ObjectGroups.Single()).Name.WaitText("Business Array Objects");
            await businessObjectsPage.ObjectGroups[0].ObjectsList.WaitCount(1);
            var link = await businessObjectsPage.ObjectGroups[0].ObjectsList.GetItemWithText(x => x.ObjectLink, "ApiClientThrift");
            var searchPage = await link.ObjectLink.ClickAndGoTo<PwBusinessObjectTablePage>();

            await searchPage.Header.WaitText("ApiClientThrift");
            var id = await searchPage.FilterModal.GetFilter("Id");
            var scopeId = await searchPage.FilterModal.GetFilter("ScopeId");
            var arrayIndex = await searchPage.FilterModal.GetFilter("ArrayIndex");

            await id.Input.ClearAndInputText("123");
            await scopeId.Input.ClearAndInputText("123");

            await searchPage.FilterModal.Apply.Click();
            await arrayIndex.InputValidation.ExpectIsOpenedWithMessage("Поле должно быть заполнено");

            await arrayIndex.Input.ClearAndInputText("    ");
            await searchPage.FilterModal.Apply.Click();
            await arrayIndex.InputValidation.ExpectIsOpenedWithMessage("Поле должно быть заполнено");

            await arrayIndex.Input.ClearAndInputText("<script>");
            await searchPage.FilterModal.Apply.Click();
            await arrayIndex.InputValidation.ExpectIsOpenedWithMessage("Некорректный символ: '<'");

            await arrayIndex.Input.ClearAndInputText("123");

            await scopeId.Input.ClearAndInputText("    ");
            await searchPage.FilterModal.Apply.Click();
            await scopeId.InputValidation.ExpectIsOpenedWithMessage("Поле должно быть заполнено");

            await scopeId.Input.ClearAndInputText(">##");
            await searchPage.FilterModal.Apply.Click();
            await scopeId.InputValidation.ExpectIsOpenedWithMessage("Некорректный символ: '>'");

            await scopeId.Input.ClearAndInputText("123");

            await id.Input.Clear();
            await searchPage.FilterModal.Apply.Click();
            await id.InputValidation.ExpectIsOpenedWithMessage("Поле должно быть заполнено");

            await id.Input.ClearAndInputText("&##");
            await searchPage.FilterModal.Apply.Click();
            await id.InputValidation.ExpectIsOpenedWithMessage("Некорректный символ: '&'");
        }

        /// <summary>
        ///     Проверяем, что не индексированные объекты находятся
        /// </summary>
        [Test]
        public async Task TestFindObject()
        {
            var objectId = Guid.NewGuid().ToString("D");
            var lastEventId = Guid.NewGuid().ToString("D");
            CreateApiClient(objectId, lastEventId);

            await using var browser = new Browser();

            var searchPage = await browser.SwitchTo<PwBusinessObjectTablePage>("ApiClientThrift");
            await (await searchPage.FilterModal.GetFilter("Id")).Input.ClearAndInputText(objectId);
            await (await searchPage.FilterModal.GetFilter("ScopeId")).Input.ClearAndInputText("scopeId");
            await (await searchPage.FilterModal.GetFilter("ArrayIndex")).Input.ClearAndInputText("arrayIndex");
            await searchPage.FilterModal.Apply.Click();
            await searchPage.BusinessObjectItems.WaitCount(1);

            var detailsPage = await searchPage.BusinessObjectItems[0].Details.ClickAndGoTo<PwBusinessObjectDetailsPage>();
            await detailsPage.RootAccordion.FindField("Id").FieldValue.WaitText(objectId);
            await detailsPage.RootAccordion.FindField("ScopeId").FieldValue.WaitText("scopeId");
            await detailsPage.RootAccordion.FindField("ArrayIndex").FieldValue.WaitText("arrayIndex");
            await detailsPage.RootAccordion.FindField("Description").FieldValue.WaitText(lastEventId);
        }

        /// <summary>
        ///     Проверяем, что при попытке поискать несуществующий объект нас перекидывает на 404
        /// </summary>
        [Test]
        public async Task TestObjectNotFound()
        {
            await using var browser = new Browser();

            var searchPage = await browser.SwitchTo<PwBusinessObjectTablePage>("ApiClientThrift");
            await searchPage.Header.WaitText("ApiClientThrift");
            await (await searchPage.FilterModal.GetFilter("Id")).Input.ClearAndInputText("123");
            await (await searchPage.FilterModal.GetFilter("ScopeId")).Input.ClearAndInputText("123");
            await (await searchPage.FilterModal.GetFilter("ArrayIndex")).Input.ClearAndInputText("123");
            await searchPage.FilterModal.Apply.Click();

            await searchPage.NothingFound.WaitPresence();
            await searchPage.BusinessObjectItems.WaitAbsence();
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