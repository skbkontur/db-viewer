using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

using NUnit.Framework;

using SkbKontur.DbViewer.TestApi.EntityFramework;
using SkbKontur.DbViewer.Tests.FrontTests.Helpers;
using SkbKontur.DbViewer.Tests.FrontTests.Pages;

using ConfirmDeleteObjectModal = SkbKontur.DbViewer.Tests.FrontTests.Controls.ConfirmDeleteObjectModal;

namespace SkbKontur.DbViewer.Tests.FrontTests
{
    public class BusinessObjectsDeleteTest
    {
        /// <summary>
        ///     Проверяем, что кнопка с удалением бизнес объекта на странице с таблицей доступна только с SuperUserAccessLevel.God
        /// </summary>
        [Test]
        public async Task DeleteViaSearchPageRequiresGodAccess()
        {
            var ftpUser = CreateFtpUser();

            await using var browser = new BrowserForTests();
            var businessObjectPage = await browser.SwitchTo<BusinessObjectTablePage>("FtpUser");

            await businessObjectPage.OpenFilter.Click();
            await (await businessObjectPage.FilterModal.GetFilter("Login")).Input.ClearAndInputText(ftpUser.Login);
            await businessObjectPage.FilterModal.Apply.Click();

            await businessObjectPage.BusinessObjectItems.WaitCount(1);
            await businessObjectPage.BusinessObjectItems[0].Delete.WaitAbsence();
        }

        /// <summary>
        ///     Пытаемся удалить бизнес объект на странице с таблицей, во всплывающем окне либо подтверждаем, либо отменяем действие.
        ///     Проверяем, что в первом случае объект удалился, во втором - нет
        /// </summary>
        /// <param name="confirmDeletion"></param>
        [TestCase(true)]
        [TestCase(false)]
        public async Task DeleteViaSearchPage(bool confirmDeletion)
        {
            var ftpUser = CreateFtpUser();

            await using var browser = new BrowserForTests();
            var businessObjectPage = await (await browser.LoginAsSuperUser()).SwitchTo<BusinessObjectTablePage>("FtpUser");

            await businessObjectPage.OpenFilter.Click();
            await (await businessObjectPage.FilterModal.GetFilter("Login")).Input.ClearAndInputText(ftpUser.Login);
            await businessObjectPage.FilterModal.Apply.Click();

            await businessObjectPage.BusinessObjectItems.WaitCount(1);
            await businessObjectPage.BusinessObjectItems[0].Delete.Click();
            await ConfirmDeletion(businessObjectPage.ConfirmDeleteObjectModal, confirmDeletion);

            if (confirmDeletion)
                await businessObjectPage.BusinessObjectItems.WaitAbsence();

            AssertFtpUserExistence(ftpUser.Id, confirmDeletion);
        }

        /// <summary>
        ///     Проверяем, что кнопка с удалением бизнес объекта на странице с конкретным объектом доступна только с SuperUserAccessLevel.God
        /// </summary>
        [Test]
        public async Task DeleteViaDetailsPageRequiresGodAccess()
        {
            var ftpUser = CreateFtpUser();

            await using var browser = new BrowserForTests();
            var detailsPage = await browser.SwitchTo<BusinessObjectDetailsPage>("FtpUser", $"Id={ftpUser.Id}");
            await detailsPage.Delete.WaitAbsence();
        }

        /// <summary>
        ///     Пытаемся удалить бизнес объект на странице с конкретным объектом, во всплывающем окне либо подтверждаем, либо отменяем действие.
        ///     Проверяем, что в первом случае объект удалился, во втором - нет
        /// </summary>
        /// <param name="confirmDeletion"></param>
        [TestCase(true)]
        [TestCase(false)]
        public async Task DeleteViaDetailsPage(bool confirmDeletion)
        {
            var ftpUser = CreateFtpUser();

            await using var browser = new BrowserForTests();
            var detailsPage = await (await browser.LoginAsSuperUser()).SwitchTo<BusinessObjectDetailsPage>("FtpUser", $"Id={ftpUser.Id}");
            await detailsPage.Delete.Click();
            await ConfirmDeletion(detailsPage.ConfirmDeleteObjectModal, confirmDeletion);

            if (confirmDeletion)
                detailsPage.GoTo<BusinessObjectTablePage>();

            AssertFtpUserExistence(ftpUser.Id, confirmDeletion);
        }

        private static Task ConfirmDeletion(ConfirmDeleteObjectModal modal, bool confirmDeletion)
        {
            return confirmDeletion
                       ? modal.Delete.Click()
                       : modal.Cancel.Click();
        }

        private static void AssertFtpUserExistence(Guid userId, bool deletionConfirmed)
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

        private static FtpUser CreateFtpUser()
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

        private static FtpUser? GetFtpUser(Guid userId)
        {
            using var context = new EntityFrameworkDbContext();
            return context.FtpUsers.Where(x => x.Id == userId).ToArray().SingleOrDefault();
        }
    }
}