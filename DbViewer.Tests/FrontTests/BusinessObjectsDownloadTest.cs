using System;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

using FluentAssertions;

using NUnit.Framework;

using SkbKontur.DbViewer.TestApi.EntityFramework;
using SkbKontur.DbViewer.Tests.FrontTests.Pages;
using SkbKontur.DbViewer.Tests.FrontTests.Playwright;

namespace SkbKontur.DbViewer.Tests.FrontTests
{
    public class BusinessObjectsDownloadTest
    {
        /// <summary>
        ///     Проверяем, что супер-разработчик и разработчик может скачать больше 50000 объектов
        ///     Проверяем, что не супер-разработчик/разработчик не может скачать больше 50000 объектов
        /// </summary>
        [Test]
        public async Task TestRestrictionsForManyItems()
        {
            var totalCount = 100123;
            var scopeId = GenerateRandomUsersAndAssertCount(totalCount)[0].ScopeId;

            await using var browser = new Browser();
            var businessObjectPage = await browser.SwitchTo<PwBusinessObjectTablePage>("UsersTable");

            await businessObjectPage.OpenFilter.Click();
            await businessObjectPage.FilterModal.ScopeId.ClearAndInputText(scopeId);
            await businessObjectPage.FilterModal.Apply.Click();
            await businessObjectPage.ItemsCountInfo.WaitTextContains("Всего 50000+");

            await businessObjectPage.DownloadLink.Click();
            await businessObjectPage.DownloadLimitModal.Header.WaitText("Слишком большой список");
            await businessObjectPage.DownloadLimitModal.Body.WaitText("Мы умеем выгружать не более 50000 объектов из этой таблицы. Уточните запрос с помощью фильтров, чтобы записей стало меньше.");
            await businessObjectPage.DownloadLimitModal.Cancel.Click();

            var adminBusinessObjectPage = await (await browser.LoginAsSuperUser()).SwitchTo<PwBusinessObjectTablePage>("UsersTable");

            await adminBusinessObjectPage.OpenFilter.Click();
            await adminBusinessObjectPage.FilterModal.ScopeId.ClearAndInputText(scopeId);
            await adminBusinessObjectPage.FilterModal.Apply.Click();
            await adminBusinessObjectPage.ItemsCountInfo.WaitTextContains("Всего 100123");

            var content = await DownloadFile(browser, businessObjectPage);
            content.Length.Should().Be(100124);
        }

        /// <summary>
        ///     Проверяем скачивание файла с пустым списком объектов
        /// </summary>
        [Test]
        public async Task TestEmptyList()
        {
            await using var browser = new Browser();
            var businessObjectPage = await browser.SwitchTo<PwBusinessObjectTablePage>("UsersTable");

            await businessObjectPage.OpenFilter.Click();
            await businessObjectPage.FilterModal.ScopeId.ClearAndInputText(Guid.NewGuid().ToString());
            await businessObjectPage.FilterModal.Apply.Click();
            await businessObjectPage.ItemsCountInfo.WaitTextContains("Всего 0");
            await businessObjectPage.NothingFound.WaitPresence();

            var content = await DownloadFile(browser, businessObjectPage);
            content.Length.Should().Be(1);
        }

        /// <summary>
        ///     Проверяем, что не супер-разработчик/разработчик может скачать 50000 объектов
        /// </summary>
        [Test]
        public async Task TestRestrictionsFor50000Items()
        {
            var scopeId = GenerateRandomUsersAndAssertCount(50000)[0].ScopeId;

            await using var browser = new Browser();
            var businessObjectPage = await browser.SwitchTo<PwBusinessObjectTablePage>("UsersTable");

            await businessObjectPage.OpenFilter.Click();
            await businessObjectPage.FilterModal.ScopeId.ClearAndInputText(scopeId);
            await businessObjectPage.FilterModal.Apply.Click();
            await businessObjectPage.ItemsCountInfo.WaitTextContains("Всего 50000");

            var content = await DownloadFile(browser, businessObjectPage);
            content.Length.Should().Be(50001);
        }

        /// <summary>
        ///     Применяем фильтр с отображением всех колонок, находим 10 записей, скачиваем их, проверяем контент
        /// </summary>
        [Test]
        public async Task TestContent()
        {
            var users = GenerateRandomUsersAndAssertCount(10);
            var scopeId = users[0].ScopeId;

            await using var browser = new Browser();
            var businessObjectPage = await browser.SwitchTo<PwBusinessObjectTablePage>("UsersTable");

            await businessObjectPage.OpenFilter.Click();
            await businessObjectPage.FilterModal.ScopeId.ClearAndInputText(scopeId);
            await businessObjectPage.FilterModal.Apply.Click();

            var content = await DownloadFile(browser, businessObjectPage);
            content.Length.Should().Be(11);

            var usersById = users.ToDictionary(x => x.Id.ToString(), x => x);
            var sep = ";";
            var headerFields = new[] {"Id", "ScopeId", "LastModificationDateTime", "Email", "FirstName", "Surname", "Patronymic", "IsSuperUser"};
            var header = string.Join(sep, headerFields.Select(FormatString));
            content[0].Should().Be(header);
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
        }

        /// <summary>
        ///     Применяем фильтр с отображением всех колонок, находим 10 записей
        ///     Оставляем отображение только колонок Email, Id, ScopeId, LastModificationDateTime
        ///     + делаем сортировку по email и проверяем, что в скачанном файле остались только нужные отсортированные колонки
        /// </summary>
        [Test]
        public async Task TestContentSortedAndSelectColumns()
        {
            var users = GenerateRandomUsersAndAssertCount(10);
            var scopeId = users[0].ScopeId;

            await using var browser = new Browser();
            var businessObjectPage = await browser.SwitchTo<PwBusinessObjectTablePage>("UsersTable");

            await businessObjectPage.OpenFilter.Click();
            await businessObjectPage.FilterModal.ScopeId.ClearAndInputText(scopeId);
            await businessObjectPage.FilterModal.Apply.Click();

            await businessObjectPage.TableHeader.SortByColumn("Header_Id");
            var columns = new[] {"Email", "Id", "ScopeId", "LastModificationDateTime"};
            await businessObjectPage.FieldSettings.Click();
            await businessObjectPage.ColumnSelector.TypesSelectAll.Click();
            foreach (var column in columns)
                await businessObjectPage.ColumnSelector.ColumnCheckboxes.GetCheckbox(column).Click();

            var content = await DownloadFile(browser, businessObjectPage);
            content.Length.Should().Be(11);

            var usersById = users.ToDictionary(x => x.Id.ToString(), x => x);
            var sep = ";";
            var headerFields = new[] {"Id", "ScopeId", "LastModificationDateTime", "Email"};
            var header = string.Join(sep, headerFields.Select(FormatString));
            content[0].Should().Be(header);
            for (var i = 1; i < 11; i++)
            {
                var item = content[i].Split(new[] {sep}, StringSplitOptions.None);
                var key = item[0].Replace("\"", "").Replace("=", "");
                var user = usersById[key];
                item[0].Should().Be(FormatString(key));
                item[1].Should().Be(FormatString(user.ScopeId));
                DateTime.TryParseExact(item[2].Replace("\"", ""), "O", CultureInfo.InvariantCulture, DateTimeStyles.None, out _).Should().BeTrue();
                item[3].Should().Be(FormatString(user.Email));
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

        private static async Task<string[]> DownloadFile(Browser browser, PwBusinessObjectTablePage businessObjectPage)
        {
            var waitForDownloadTask = browser.Page.WaitForDownloadAsync();
            await businessObjectPage.DownloadLink.Click();
            var download = await waitForDownloadTask;

            var filename = $"UsersTable-{DateTime.UtcNow:yyyy-MM-dd-HHmm}.csv";
            download.SuggestedFilename.Should().Be(filename);

            var fullName = $"{TestContext.CurrentContext.TestDirectory}/Files/{download.SuggestedFilename}";
            await download.SaveAsAsync(fullName);

            var content = await File.ReadAllLinesAsync(fullName);
            if (content.Length == 1)
                Console.WriteLine($"File Content: '{content[0]}'");
            return content;
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