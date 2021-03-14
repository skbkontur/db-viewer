using System;
using System.Linq;

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
        public void TestAllowSort()
        {
            using (var context = new EntityFrameworkDbContext())
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
                context.SaveChanges();
            }

            using var browser = new BrowserForTests();

            var usersPage = browser.LoginAsSuperUser().SwitchTo<BusinessObjectTablePage>("UsersTable");
            usersPage = browser.RefreshUntil(usersPage, x => x.BusinessObjectItems.IsPresent.Get());
            usersPage.TableHeader.WaitPresence();
            usersPage.TableHeader.SortByColumn("Header_Id");

            var largeObjectPage = browser.SwitchTo<BusinessObjectTablePage>("TestTable");
            largeObjectPage = browser.RefreshUntil(largeObjectPage, x => x.BusinessObjectItems.IsPresent.Get());
            largeObjectPage.TableHeader.WaitPresence();
            largeObjectPage.TableHeader.WaitNotSortable("Header_Index");
            largeObjectPage.TableHeader.WaitNotSortable("Header_String");
            largeObjectPage.TableHeader.WaitNotSortable("Header_DateTime");
        }

        /// <summary>
        ///     Проверяем, что при некорректные символы и пустые строки корректно обрабатываются
        /// </summary>
        [Test]
        public void TestInputValidation()
        {
            CreateUsers(1, Guid.NewGuid().ToString());

            using var browser = new BrowserForTests();

            var userBusinessObjectPage = browser.SwitchTo<BusinessObjectTablePage>("UsersTable");
            userBusinessObjectPage.OpenFilter.Click();
            var filter = userBusinessObjectPage.FilterModal.GetFilter("ScopeId");
            filter.Input.ClearAndInputText("<script>");
            userBusinessObjectPage.FilterModal.Apply.Click();
            filter.InputValidation.ExpectIsOpenedWithMessage("Некорректный символ: '<'");
            filter.Input.ClearAndInputText("    ");
            userBusinessObjectPage.FilterModal.Apply.Click();
            userBusinessObjectPage.FilterModal.WaitAbsence();
            userBusinessObjectPage.NothingFound.WaitAbsence();
            userBusinessObjectPage.BusinessObjectItems.Count.Wait().That(Is.GreaterThan(0));
        }

        /// <summary>
        ///     Проверяем, что работает фильтрация в таблице объектов
        ///     Генерим уникальный гуид и по нему фильтруем список объектов и проверяем что находится именно он
        /// </summary>
        [Test]
        public void TestTableFiltration()
        {
            var scopeId = Guid.NewGuid().ToString();
            CreateUsers(21, scopeId);

            var filtrationGuid = Guid.NewGuid();
            CreateUsers(1, scopeId, filtrationGuid);

            using var browser = new BrowserForTests();
            var userBusinessObjectPage = browser.SwitchTo<BusinessObjectTablePage>("UsersTable");
            userBusinessObjectPage.OpenFilter.Click();
            userBusinessObjectPage.FilterModal.Id.ClearAndInputText(filtrationGuid.ToString());
            userBusinessObjectPage.FilterModal.Apply.Click();

            userBusinessObjectPage.BusinessObjectItems.WaitCount(1);
            userBusinessObjectPage.BusinessObjectItems[0].Id.WaitText(filtrationGuid.ToString());
        }

        /// <summary>
        ///     Проверяем, что работает настройка полей в таблице объектов
        ///     Убираем поле ID из таблицы, провеям что такого ID на странице нет, проверяем, что ScopeId есть
        /// </summary>
        [Test]
        public void TestTableSettingField()
        {
            var scopeId = Guid.NewGuid().ToString();
            CreateUsers(21, scopeId);

            var filtrationGuid = Guid.NewGuid();
            CreateUsers(1, scopeId, filtrationGuid);

            using var browser = new BrowserForTests();
            var userBusinessObjectPage = browser.SwitchTo<BusinessObjectTablePage>("UsersTable");
            userBusinessObjectPage.OpenFilter.Click();
            userBusinessObjectPage.FilterModal.Id.ClearAndInputText(filtrationGuid.ToString());
            userBusinessObjectPage.FilterModal.Apply.Click();

            userBusinessObjectPage.FieldSettings.Click();
            userBusinessObjectPage.ColumnSelector.ColumnCheckboxes.GetCheckbox("Id").Click();
            userBusinessObjectPage.Header.Click();
            userBusinessObjectPage.BusinessObjectItems[0].Id.WaitAbsence();
            userBusinessObjectPage.BusinessObjectItems[0].ScopeId.WaitText(scopeId);
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