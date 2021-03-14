using System;
using System.Linq;

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
        public void TestTwoPages()
        {
            var scopeId = Guid.NewGuid().ToString();
            CreateFtpUsers(21, scopeId);

            using var browser = new BrowserForTests();

            var businessObjectsPage = browser.SwitchTo<BusinessObjectsPage>();
            businessObjectsPage.FilterInput.ClearAndInputText("FtpUser");
            var ftpUsersLink = businessObjectsPage.ObjectGroups[0].ObjectsList.GetItemWithText(x => x.ObjectLink.Text, "FtpUser");

            var ftpUsersPage = ftpUsersLink.ObjectLink.ClickAndGoTo<BusinessObjectTablePage>();
            ftpUsersPage.OpenFilter.Click();
            ftpUsersPage.FilterModal.GetFilter("Login").Input.ClearAndInputText(scopeId);
            ftpUsersPage.FilterModal.Apply.Click();

            ftpUsersPage = browser.RefreshUntil(ftpUsersPage, page => page.ItemsCountInfo.Text.Get().Contains("Всего 21"));
            ftpUsersPage.ItemsCountInfo.WaitTextContains("Записи с 0 по 20", "Всего 21");
            ftpUsersPage.BusinessObjectItems.WaitCount(20);
            ftpUsersPage.Paging.PagesCount.Wait().That(Is.EqualTo(2));
            ftpUsersPage.Paging.GoToPage(2);
            ftpUsersPage.ItemsCountInfo.WaitTextContains("Записи с 20 по 21", "Всего 21");
            ftpUsersPage.BusinessObjectItems.WaitCount(1);
        }

        /// <summary>
        ///     Проверяем, что переключение количества отображаемых объектов в таблице работает.
        ///     Создаем 51 бизнес объект, в таблице с бизнес объектами смотрим, что появилось 3 страницы, на первой 20 объектов, на второй еще 20, на третей - 11.
        ///     Включаем отображение 50 объектов на одной странице, проверяем, что страниц стало 2, на первой 50 объектов, на второй - 1
        /// </summary>
        [Test]
        public void TestThreePages()
        {
            var scopeId = Guid.NewGuid().ToString();
            CreateFtpUsers(51, scopeId);

            using var browser = new BrowserForTests();

            var ftpUsersPage = browser.SwitchTo<BusinessObjectTablePage>("FtpUser");
            ftpUsersPage.OpenFilter.Click();
            ftpUsersPage.FilterModal.GetFilter("Login").Input.ClearAndInputText(scopeId);
            ftpUsersPage.FilterModal.Apply.Click();

            ftpUsersPage = browser.RefreshUntil(ftpUsersPage, page => page.ItemsCountInfo.Text.Get().Contains("Всего 51"));
            ftpUsersPage.ItemsCountInfo.WaitTextContains("Записи с 0 по 20", "Всего 51");
            ftpUsersPage.BusinessObjectItems.WaitCount(20);
            ftpUsersPage.Paging.PagesCount.Wait().That(Is.EqualTo(3));
            ftpUsersPage.Paging.GoToPage(2);
            ftpUsersPage.ItemsCountInfo.WaitTextContains("Записи с 20 по 40", "Всего 51");
            ftpUsersPage.BusinessObjectItems.WaitCount(20);
            ftpUsersPage.Paging.GoToPage(3);
            ftpUsersPage.ItemsCountInfo.WaitTextContains("Записи с 40 по 51", "Всего 51");
            ftpUsersPage.BusinessObjectItems.WaitCount(11);

            ftpUsersPage.Paging.GoToPage(1);
            ftpUsersPage.ItemsCountInfo.WaitTextContains("Записи с 0 по 20", "Всего 51");
            ftpUsersPage.CountDropdown.CurrentCount.Click();
            ftpUsersPage.CountDropdown.Menu.GetItemByUniqueTid("##50Items").Click();
            ftpUsersPage.ItemsCountInfo.WaitTextContains("Записи с 0 по 50", "Всего 51");
            ftpUsersPage.BusinessObjectItems.WaitCount(50);
            ftpUsersPage.Paging.PagesCount.Wait().That(Is.EqualTo(2));
            ftpUsersPage.Paging.GoToPage(2);
            ftpUsersPage.ItemsCountInfo.WaitTextContains("Записи с 50 по 51", "Всего 51");
            ftpUsersPage.BusinessObjectItems.WaitCount(1);
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