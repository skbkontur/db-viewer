using System;
using System.Linq;
using System.Threading.Tasks;

using NUnit.Framework;

using SkbKontur.DbViewer.TestApi.EntityFramework;
using SkbKontur.DbViewer.Tests.FrontTests.Helpers;
using SkbKontur.DbViewer.Tests.FrontTests.Pages;

namespace SkbKontur.DbViewer.Tests.FrontTests
{
    public class BusinessObjectsTableNavigationTest
    {
        /// <summary>
        ///     Проверяем, что навигация по таблице с бизнес объектами работает.
        ///     Создаем 21 бизнес объект, в таблице с бизнес объектами смотрим, что появилось 2 страницы, на первой 20 объектов, на второй - 1
        /// </summary>
        [Test]
        public async Task TestTwoPages()
        {
            var scopeId = Guid.NewGuid().ToString();
            CreateFtpUsers(21, scopeId);

            await using var browser = new BrowserForTests();

            var businessObjectsPage = await browser.SwitchTo<BusinessObjectsPage>();
            await businessObjectsPage.FilterInput.ClearAndInputText("FtpUser");
            var ftpUsersLink = await businessObjectsPage.ObjectGroups[0].ObjectsList.GetItemWithText(x => x.ObjectLink, "FtpUser");

            var ftpUsersPage = await ftpUsersLink.ObjectLink.ClickAndGoTo<BusinessObjectTablePage>();
            await ftpUsersPage.OpenFilter.Click();
            await (await ftpUsersPage.FilterModal.GetFilter("Login")).Input.ClearAndInputText(scopeId);
            await ftpUsersPage.FilterModal.Apply.Click();

            ftpUsersPage = await browser.RefreshUntil(ftpUsersPage, async page => (await page.ItemsCountInfo.Locator.TextContentAsync())?.Contains("Всего 21") == true);
            await ftpUsersPage.ItemsCountInfo.WaitText("Записи с 0 по 20|Всего 21");
            await ftpUsersPage.BusinessObjectItems.WaitCount(20);
            await ftpUsersPage.Paging.Pages.WaitCount(2);
            await ftpUsersPage.Paging.Pages[1].Click();
            await ftpUsersPage.ItemsCountInfo.WaitText("Записи с 20 по 21|Всего 21");
            await ftpUsersPage.BusinessObjectItems.WaitCount(1);
        }

        /// <summary>
        ///     Проверяем, что переключение количества отображаемых объектов в таблице работает.
        ///     Создаем 51 бизнес объект, в таблице с бизнес объектами смотрим, что появилось 3 страницы, на первой 20 объектов, на второй еще 20, на третей - 11.
        ///     Включаем отображение 50 объектов на одной странице, проверяем, что страниц стало 2, на первой 50 объектов, на второй - 1
        /// </summary>
        [Test]
        public async Task TestThreePages()
        {
            var scopeId = Guid.NewGuid().ToString();
            CreateFtpUsers(51, scopeId);

            await using var browser = new BrowserForTests();

            var ftpUsersPage = await browser.SwitchTo<BusinessObjectTablePage>("FtpUser");
            await ftpUsersPage.OpenFilter.Click();
            await (await ftpUsersPage.FilterModal.GetFilter("Login")).Input.ClearAndInputText(scopeId);
            await ftpUsersPage.FilterModal.Apply.Click();

            ftpUsersPage = await browser.RefreshUntil(ftpUsersPage, async page => (await page.ItemsCountInfo.Locator.TextContentAsync())?.Contains("Всего 51") == true);
            await ftpUsersPage.ItemsCountInfo.WaitText("Записи с 0 по 20|Всего 51");
            await ftpUsersPage.BusinessObjectItems.WaitCount(20);
            await ftpUsersPage.Paging.Pages.WaitCount(3);
            await ftpUsersPage.Paging.Pages[1].Click();
            await ftpUsersPage.ItemsCountInfo.WaitText("Записи с 20 по 40|Всего 51");
            await ftpUsersPage.BusinessObjectItems.WaitCount(20);
            await ftpUsersPage.Paging.Pages[2].Click();
            await ftpUsersPage.ItemsCountInfo.WaitText("Записи с 40 по 51|Всего 51");
            await ftpUsersPage.BusinessObjectItems.WaitCount(11);

            await ftpUsersPage.Paging.Pages[0].Click();
            await ftpUsersPage.ItemsCountInfo.WaitText("Записи с 0 по 20|Всего 51");

            await ftpUsersPage.CountDropdown.CurrentCount.Click();
            await ftpUsersPage.CountDropdown.Menu.WaitText("50", "100");
            await ftpUsersPage.CountDropdown.Menu[0].Click();

            await ftpUsersPage.ItemsCountInfo.WaitText("Записи с 0 по 50|Всего 51");
            await ftpUsersPage.BusinessObjectItems.WaitCount(50);
            await ftpUsersPage.Paging.Pages.WaitCount(2);
            await ftpUsersPage.Paging.Pages[1].Click();
            await ftpUsersPage.ItemsCountInfo.WaitText("Записи с 50 по 51|Всего 51");
            await ftpUsersPage.BusinessObjectItems.WaitCount(1);
        }

        private static void CreateFtpUsers(int count, string login)
        {
            using var context = new EntityFrameworkDbContext();
            context.FtpUsers.AddRange(Enumerable.Range(0, count).Select(_ => new FtpUser
                {
                    Login = login,
                    BoxId = Guid.NewGuid().ToString(),
                    Id = Guid.NewGuid(),
                }));
            context.SaveChanges();
        }
    }
}