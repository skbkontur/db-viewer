using System;
using System.Globalization;
using System.Linq;

using FluentAssertions;

using NUnit.Framework;

using SkbKontur.DbViewer.TestApi.EntityFramework;
using SkbKontur.DbViewer.Tests.FrontTests.Helpers;
using SkbKontur.DbViewer.Tests.FrontTests.Pages;

namespace SkbKontur.DbViewer.Tests.FrontTests
{
    public class BusinessObjectsDownloadTest
    {
        /// <summary>
        ///     Проверяем, что супер-разработчик и разработчик может скачать больше 50000 объектов
        ///     Проверяем, что не супер-разработчик/разработчик не может скачать больше 50000 объектов
        /// </summary>
        [Test]
        public void TestRestrictionsForManyItems()
        {
            var totalCount = 100123;
            var scopeId = GenerateRandomUsersAndAssertCount(totalCount)[0].ScopeId;

            using var browser = new BrowserForTests();
            var businessObjectPage = browser.SwitchTo<BusinessObjectTablePage>("UsersTable");

            businessObjectPage.OpenFilter.Click();
            businessObjectPage.FilterModal.ScopeId.ClearAndInputText(scopeId);
            businessObjectPage.FilterModal.Apply.Click();
            businessObjectPage.ItemsCountInfo.WaitTextContains("Всего 50000+");

            businessObjectPage.DownloadLink.Click();
            businessObjectPage.DownloadLimitModal.Header.WaitText("Слишком большой список");
            businessObjectPage.DownloadLimitModal.Body.WaitText("Мы умеем выгружать не более 50000 объектов из этой таблицы. Уточните запрос с помощью фильтров, чтобы записей стало меньше.");
            businessObjectPage.DownloadLimitModal.Cancel.Click();

            var adminBusinessObjectPage = browser.LoginAsSuperUser().SwitchTo<BusinessObjectTablePage>("UsersTable");

            adminBusinessObjectPage.OpenFilter.Click();
            adminBusinessObjectPage.FilterModal.ScopeId.ClearAndInputText(scopeId);
            adminBusinessObjectPage.FilterModal.Apply.Click();
            adminBusinessObjectPage.ItemsCountInfo.WaitTextContains("Всего 100123");

            adminBusinessObjectPage.DownloadLink.Click();
            var file = browser.DownloadFile($"UsersTable-{DateTime.UtcNow:yyyy-MM-dd-HHmm}.csv");
            file.Split("\n").Length.Should().Be(100125);
        }

        /// <summary>
        ///     Проверяем скачивание файла с пустым списком объектов
        /// </summary>
        [Test]
        public void TestEmptyList()
        {
            using var browser = new BrowserForTests();
            var businessObjectPage = browser.SwitchTo<BusinessObjectTablePage>("UsersTable");

            businessObjectPage.OpenFilter.Click();
            businessObjectPage.FilterModal.ScopeId.ClearAndInputText(Guid.NewGuid().ToString());
            businessObjectPage.FilterModal.Apply.Click();
            businessObjectPage.ItemsCountInfo.WaitTextContains("Всего 0");
            businessObjectPage.NothingFound.WaitPresence();

            businessObjectPage.DownloadLink.Click();
            var file = browser.DownloadFile($"UsersTable-{DateTime.UtcNow:yyyy-MM-dd-HHmm}.csv");
            file.Split("\n").Length.Should().Be(2);
        }

        /// <summary>
        ///     Проверяем, что не супер-разработчик/разработчик может скачать 50000 объектов
        /// </summary>
        [Test]
        public void TestRestrictionsFor50000Items()
        {
            var scopeId = GenerateRandomUsersAndAssertCount(50000)[0].ScopeId;

            using var browser = new BrowserForTests();
            var businessObjectPage = browser.SwitchTo<BusinessObjectTablePage>("UsersTable");

            businessObjectPage.OpenFilter.Click();
            businessObjectPage.FilterModal.ScopeId.ClearAndInputText(scopeId);
            businessObjectPage.FilterModal.Apply.Click();
            businessObjectPage.ItemsCountInfo.WaitTextContains("Всего 50000");

            businessObjectPage.DownloadLink.Click();
            var file = browser.DownloadFile($"UsersTable-{DateTime.UtcNow:yyyy-MM-dd-HHmm}.csv");
            file.Split("\n").Length.Should().Be(50002);
        }

        /// <summary>
        ///     Применяем фильтр с отображением всех колонок, находим 10 записей, скачиваем их, проверяем контент
        ///     С тем же фильтром оставляем отображение только колонок Email, Id, ScopeId, LastModificationDateTime
        ///     + делаем сортировку по email и проверяем, что в скачанном файле остались только нужные отсортированные колонки
        /// </summary>
        [Test]
        public void TestContent()
        {
            var users = GenerateRandomUsersAndAssertCount(10);
            var scopeId = users[0].ScopeId;

            using var browser = new BrowserForTests();
            var businessObjectPage = browser.SwitchTo<BusinessObjectTablePage>("UsersTable");

            businessObjectPage.OpenFilter.Click();
            businessObjectPage.FilterModal.ScopeId.ClearAndInputText(scopeId);
            businessObjectPage.FilterModal.Apply.Click();

            businessObjectPage.DownloadLink.Click();
            var file = browser.DownloadFile($"UsersTable-{DateTime.UtcNow:yyyy-MM-dd-HHmm}.csv");
            var content = file.Split("\n");
            content.Length.Should().Be(12);

            var usersById = users.ToDictionary(x => x.Id.ToString(), x => x);
            var sep = ";";
            var headerFields = new[] {"Id", "ScopeId", "LastModificationDateTime", "Email", "FirstName", "Surname", "Patronymic", "IsSuperUser"};
            var header = string.Join(sep, headerFields.Select(FormatString));
            content[0].Should().Be(header);
            content[11].Should().BeEmpty();
            for (var i = 1; i < 11; i++)
            {
                var item = content[i].Split(new[] {sep}, StringSplitOptions.None);
                var key = item[0].Replace("\"", "").Replace("=", "");
                var user = usersById[key];
                var empty = FormatString(string.Empty);
                item[1].Should().Be(FormatString(scopeId));
                DateTime.TryParseExact(item[2].Replace("\"", ""), "O", CultureInfo.InvariantCulture, DateTimeStyles.None, out _).Should().BeTrue();
                item[3].Should().Be(FormatString(user.Email));
                item[4].Should().Be(empty);
                item[5].Should().Be(FormatNumber("123"));
                item[6].Should().Be(FormatString("Some String"));
                item[7].Should().Be(FormatString("False"));
            }

            businessObjectPage.TableHeader.SortByColumn("Header_Id");
            SetColumns(businessObjectPage, "Email", "Id", "ScopeId", "LastModificationDateTime");

            businessObjectPage.DownloadLink.Click();
            var file2 = browser.DownloadFile($"UsersTable-{DateTime.UtcNow:yyyy-MM-dd-HHmm} (1).csv");
            var content2 = file2.Split("\n");
            content2.Length.Should().Be(12);

            var headerFields2 = new[] {"Id", "ScopeId", "LastModificationDateTime", "Email"};
            var header2 = string.Join(sep, headerFields2.Select(FormatString));
            content2[0].Should().Be(header2);
            content2[11].Should().BeEmpty();
            for (var i = 1; i < 11; i++)
            {
                var item = content2[i].Split(new[] {sep}, StringSplitOptions.None);
                var key = item[0].Replace("\"", "").Replace("=", "");
                var user = usersById[key];
                item[0].Should().Be(FormatString(key));
                item[1].Should().Be(FormatString(user.ScopeId));
                DateTime.TryParseExact(item[2].Replace("\"", ""), "O", CultureInfo.InvariantCulture, DateTimeStyles.None, out _).Should().BeTrue();
                item[3].Should().Be(FormatString(user.Email));
            }
        }

        private static void SetColumns(BusinessObjectTablePage businessObjectPage, params string[] columns)
        {
            businessObjectPage.FieldSettings.Click();
            businessObjectPage.ColumnSelector.TypesSelectAll.Click();
            foreach (var column in columns)
            {
                businessObjectPage.ColumnSelector.ColumnCheckboxes.GetCheckbox(column).Click();
            }
        }

        private static UsersTable[] GenerateRandomUsersAndAssertCount(int count)
        {
            var scopeId = Guid.NewGuid().ToString();
            var users = Enumerable.Range(0, count).Select(_ => GetRandomUser(scopeId, $"{Guid.NewGuid()}@gmail.com")).ToArray();

            using var context = new EntityFrameworkDbContext();
            context.Users.AddRange(users);
            context.SaveChanges();

            Assert.That(() => GetUserObjectsCount(scopeId, count), Is.EqualTo(count).After(180000, 1000));
            return users;
        }

        private static string FormatString(string s)
        {
            return $"\"{s}\"";
        }

        private static string FormatNumber(string n)
        {
            return $"=\"{n}\"";
        }

        private static int GetUserObjectsCount(string scopeId, int limit)
        {
            using var context = new EntityFrameworkDbContext();
            return context.Users.Where(x => x.ScopeId == scopeId).Take(limit + 1).Count();
        }

        private static UsersTable GetRandomUser(string scopeId, string email)
        {
            return new UsersTable
                {
                    Id = Guid.NewGuid(),
                    Email = email,
                    ScopeId = scopeId,
                    Patronymic = "Some String",
                    FirstName = "",
                    Surname = "123",
                    LastModificationDateTime = DateTime.UtcNow,
                };
        }
    }
}