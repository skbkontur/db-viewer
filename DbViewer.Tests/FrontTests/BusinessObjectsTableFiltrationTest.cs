using System;
using System.Linq;
using System.Threading.Tasks;

using GroBuf;
using GroBuf.DataMembersExtracters;

using NUnit.Framework;

using SkbKontur.DbViewer.TestApi.EntityFramework;
using SkbKontur.DbViewer.Tests.FrontTests.Helpers;
using SkbKontur.DbViewer.Tests.FrontTests.Pages;

namespace SkbKontur.DbViewer.Tests.FrontTests
{
    public class BusinessObjectsTableFiltrationTest
    {
        /// <summary>
        ///     EDITSKS-3065
        ///     Разрешаем сортировать в обычных бизнес объектах, запрещаем в больших
        /// </summary>
        [Test]
        public async Task TestAllowSort()
        {
            await using (var context = new EntityFrameworkDbContext())
            {
                var serializer = new Serializer(new AllPropertiesExtractor());
                var customer = new Customer {Age = 1, Name = "13"};
                context.Tests.Add(new TestTable
                    {
                        Id = 1,
                        CompositeKey = Guid.NewGuid().ToString(),
                        String = "123",
                        Customer = customer,
                        CustomerSerialized = serializer.Serialize(customer),
                    });
                context.Users.Add(new UsersTable
                    {
                        Email = "123",
                        Id = Guid.NewGuid(),
                        Patronymic = "1",
                        Surname = "2",
                        FirstName = "3",
                        ScopeId = "scopeId",
                    });
                await context.SaveChangesAsync();
            }

            await using var browser = new BrowserForTests();

            var usersPage = await (await browser.LoginAsSuperUser()).SwitchTo<BusinessObjectTablePage>("UsersTable");
            await usersPage.TableHeader.WaitPresence();
            await usersPage.TableHeader.SortByColumn("Header_Id");

            var largeObjectPage = await browser.SwitchTo<BusinessObjectTablePage>("TestTable");
            await largeObjectPage.TableHeader.WaitPresence();
            await largeObjectPage.TableHeader.WaitNotSortable("Header_Index");
            await largeObjectPage.TableHeader.WaitNotSortable("Header_String");
            await largeObjectPage.TableHeader.WaitNotSortable("Header_DateTime");
        }

        /// <summary>
        ///     Проверяем, что при некорректные символы и пустые строки корректно обрабатываются
        /// </summary>
        [Test]
        public async Task TestInputValidation()
        {
            CreateUsers(1, Guid.NewGuid().ToString());

            await using var browser = new BrowserForTests();

            var userBusinessObjectPage = await browser.SwitchTo<BusinessObjectTablePage>("UsersTable");
            await userBusinessObjectPage.OpenFilter.Click();
            var filter = await userBusinessObjectPage.FilterModal.GetFilter("ScopeId");
            await filter.Input.ClearAndInputText("<script>");
            await userBusinessObjectPage.FilterModal.Apply.Click();
            await filter.InputValidation.ExpectIsOpenedWithMessage("Некорректный символ: '<'");
            await filter.Input.ClearAndInputText("    ");
            await userBusinessObjectPage.FilterModal.Apply.Click();
            await userBusinessObjectPage.FilterModal.WaitAbsence();
            await userBusinessObjectPage.NothingFound.WaitAbsence();
            await userBusinessObjectPage.BusinessObjectItems.Expect().Not.ToHaveCountAsync(0);
        }

        /// <summary>
        ///     Проверяем, что работает фильтрация в таблице объектов
        ///     Генерим уникальный гуид и по нему фильтруем список объектов и проверяем что находится именно он
        /// </summary>
        [Test]
        public async Task TestTableFiltration()
        {
            var scopeId = Guid.NewGuid().ToString();
            CreateUsers(21, scopeId);

            var filtrationGuid = Guid.NewGuid();
            CreateUsers(1, scopeId, filtrationGuid);

            await using var browser = new BrowserForTests();
            var userBusinessObjectPage = await browser.SwitchTo<BusinessObjectTablePage>("UsersTable");
            await userBusinessObjectPage.OpenFilter.Click();
            await userBusinessObjectPage.FilterModal.Id.ClearAndInputText(filtrationGuid.ToString());
            await userBusinessObjectPage.FilterModal.Apply.Click();

            await userBusinessObjectPage.BusinessObjectItems.WaitCount(1);
            await userBusinessObjectPage.BusinessObjectItems[0].Id.WaitText(filtrationGuid.ToString());
        }

        /// <summary>
        ///     Проверяем, что работает настройка полей в таблице объектов
        ///     Убираем поле ID из таблицы, провеям что такого ID на странице нет, проверяем, что ScopeId есть
        /// </summary>
        [Test]
        public async Task TestTableSettingField()
        {
            var scopeId = Guid.NewGuid().ToString();
            CreateUsers(21, scopeId);

            var filtrationGuid = Guid.NewGuid();
            CreateUsers(1, scopeId, filtrationGuid);

            await using var browser = new BrowserForTests();
            var userBusinessObjectPage = await browser.SwitchTo<BusinessObjectTablePage>("UsersTable");
            await userBusinessObjectPage.OpenFilter.Click();
            await userBusinessObjectPage.FilterModal.Id.ClearAndInputText(filtrationGuid.ToString());
            await userBusinessObjectPage.FilterModal.Apply.Click();

            await userBusinessObjectPage.FieldSettings.Click();
            await userBusinessObjectPage.ColumnSelector.ColumnCheckboxes.GetCheckbox("Id").Click();
            await userBusinessObjectPage.Header.Click();
            await userBusinessObjectPage.BusinessObjectItems[0].Id.WaitAbsence();
            await userBusinessObjectPage.BusinessObjectItems[0].ScopeId.WaitText(scopeId);
        }

        /// <summary>
        ///     Проверяем, что при фильтрации не с первой страницы пейджинга сбрасывается offset и находятся бизнес объекты
        /// </summary>
        [Test]
        public async Task TestFiltrationWhenNotFirstPage()
        {
            var scopeId = Guid.NewGuid().ToString();
            CreateUsers(20, scopeId);

            var userId = Guid.NewGuid();
            CreateUsers(1, scopeId, userId);

            await using var browser = new BrowserForTests();

            var userBusinessObjectPage = await browser.SwitchTo<BusinessObjectTablePage>("UsersTable");
            await userBusinessObjectPage.OpenFilter.Click();
            await userBusinessObjectPage.FilterModal.ScopeId.ClearAndInputText(scopeId);
            await userBusinessObjectPage.FilterModal.Apply.Click();

            await userBusinessObjectPage.Paging.Pages[1].Click();
            await userBusinessObjectPage.BusinessObjectItems.WaitCount(1);

            await userBusinessObjectPage.OpenFilter.Click();
            await userBusinessObjectPage.FilterModal.Id.ClearAndInputText(userId.ToString());
            await userBusinessObjectPage.FilterModal.Apply.Click();

            await userBusinessObjectPage.ItemsCountInfo.WaitText("Записи с 0 по 1|Всего 1");
            await userBusinessObjectPage.BusinessObjectItems.WaitCount(1);
        }

        private static void CreateUsers(int count, string scopeId, Guid? id = null)
        {
            if (count > 1 && id != null)
                throw new InvalidOperationException();

            using var context = new EntityFrameworkDbContext();
            context.Users.AddRange(Enumerable.Range(0, count).Select(_ => new UsersTable
                {
                    Id = id ?? Guid.NewGuid(),
                    ScopeId = scopeId,
                    Email = "abc@mail.ru",
                    FirstName = "1",
                    Surname = "2",
                    Patronymic = "3",
                }));
            context.SaveChanges();
        }
    }
}