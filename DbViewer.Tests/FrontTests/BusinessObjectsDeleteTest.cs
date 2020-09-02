using System;
using System.Linq;
using System.Threading;

using NUnit.Framework;

using SkbKontur.DbViewer.TestApi.EntityFramework;
using SkbKontur.DbViewer.Tests.FrontTests.Helpers;
using SkbKontur.DbViewer.Tests.FrontTests.Pages;

namespace SkbKontur.DbViewer.Tests.FrontTests
{
    public class BusinessObjectsDeleteTest
    {
        /// <summary>
        ///     Проверяем, что кнопка с удалением бизнес объекта на странице с таблицей доступна только с SuperUserAccessLevel.God
        /// </summary>
        [Test]
        public void DeleteViaSearchPageRequiresGodAccess()
        {
            var ftpUser = CreateFtpUser();

            using var browser = new BrowserForTests();
            var businessObjectPage = browser.SwitchTo<BusinessObjectTablePage>("FtpUser");

            businessObjectPage.OpenFilter.Click();
            businessObjectPage.FilterModal.GetFilter("Login").Input.ClearAndInputText(ftpUser.Login);
            businessObjectPage.FilterModal.Apply.Click();

            businessObjectPage = browser.RefreshUntil(businessObjectPage, x => x.BusinessObjectItems.IsPresent.Get());
            businessObjectPage.BusinessObjectItems.WaitCount(1);
            businessObjectPage.BusinessObjectItems[0].Delete.IsPresent.Wait().That(Is.False, "Delete link should only be present for gods");
        }

        /// <summary>
        ///     Пытаемся удалить бизнес объект на странице с таблицей, во всплывающем окне либо подтверждаем, либо отменяем действие.
        ///     Проверяем, что в первом случае объект удалился, во втором - нет
        /// </summary>
        /// <param name="confirmDeletion"></param>
        [TestCase(true)]
        [TestCase(false)]
        public void DeleteViaSearchPage(bool confirmDeletion)
        {
            var ftpUser = CreateFtpUser();

            using var browser = new BrowserForTests();
            var businessObjectPage = browser.LoginAsSuperUser().SwitchTo<BusinessObjectTablePage>("FtpUser");

            businessObjectPage.OpenFilter.Click();
            businessObjectPage.FilterModal.GetFilter("Login").Input.ClearAndInputText(ftpUser.Login);
            businessObjectPage.FilterModal.Apply.Click();

            businessObjectPage = browser.RefreshUntil(businessObjectPage, x => x.BusinessObjectItems.IsPresent.Get());
            businessObjectPage.BusinessObjectItems.WaitCount(1);
            businessObjectPage.BusinessObjectItems[0].Delete.Click();
            ConfirmDeletion(businessObjectPage.ConfirmDeleteObjectModal, confirmDeletion);

            if (confirmDeletion)
                businessObjectPage.BusinessObjectItems.WaitAbsence();

            AssertFtpUserExistence(ftpUser.Id, confirmDeletion);
        }

        /// <summary>
        ///     Проверяем, что кнопка с удалением бизнес объекта на странице с конкретным объектом доступна только с SuperUserAccessLevel.God
        /// </summary>
        [Test]
        public void DeleteViaDetailsPageRequiresGodAccess()
        {
            var ftpUser = CreateFtpUser();

            using var browser = new BrowserForTests();
            var detailsPage = browser.SwitchTo<BusinessObjectDetailsPage>("FtpUser", $"Id={ftpUser.Id}");
            detailsPage.Delete.IsPresent.Wait().That(Is.False, "Delete link should only be present for gods");
        }

        /// <summary>
        ///     Пытаемся удалить бизнес объект на странице с конкретным объектом, во всплывающем окне либо подтверждаем, либо отменяем действие.
        ///     Проверяем, что в первом случае объект удалился, во втором - нет
        /// </summary>
        /// <param name="confirmDeletion"></param>
        [TestCase(true)]
        [TestCase(false)]
        public void DeleteViaDetailsPage(bool confirmDeletion)
        {
            var ftpUser = CreateFtpUser();

            using var browser = new BrowserForTests();
            var detailsPage = browser.LoginAsSuperUser().SwitchTo<BusinessObjectDetailsPage>("FtpUser", $"Id={ftpUser.Id}");
            detailsPage.Delete.Click();
            ConfirmDeletion(detailsPage.ConfirmDeleteObjectModal, confirmDeletion);

            if (confirmDeletion)
                detailsPage.GoTo<BusinessObjectTablePage>();

            AssertFtpUserExistence(ftpUser.Id, confirmDeletion);
        }

        private static void ConfirmDeletion(ConfirmDeleteObjectModal modal, bool confirmDeletion)
        {
            if (confirmDeletion)
                modal.Delete.Click();
            else
                modal.Cancel.Click();
        }

        private void AssertFtpUserExistence(Guid userId, bool deletionConfirmed)
        {
            if (deletionConfirmed)
            {
                Assert.That(() => GetFtpUser(userId), Is.Null.After(2000, 100), "Failed to delete ftp user: User still exists");
                return;
            }

            // Проверяем, что пользователь действительно не удалился после 2000 ms
            Thread.Sleep(2000);
            Assert.That(() => GetFtpUser(userId), Is.Not.Null, "Deleted ftp user despite denying confirmation");
        }

        private FtpUser CreateFtpUser()
        {
            using var context = new EntityFrameworkDbContext();

            var userId = Guid.NewGuid();
            var ftpUser = new FtpUser
                {
                    Login = Guid.NewGuid().ToString(),
                    BoxId = Guid.NewGuid().ToString(),
                    Id = userId,
                };

            context.FtpUsers.Add(ftpUser);
            context.SaveChanges();

            Assert.That(GetFtpUser(userId), Is.Not.Null, "Failed to create ftp user");
            return ftpUser;
        }

        private FtpUser GetFtpUser(Guid userId)
        {
            using var context = new EntityFrameworkDbContext();
            return context.FtpUsers.Where(x => x.Id == userId).ToArray().SingleOrDefault();
        }
    }
}