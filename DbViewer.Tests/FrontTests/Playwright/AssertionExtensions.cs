using System;
using System.Diagnostics;
using System.Threading;
using System.Threading.Tasks;

using Microsoft.Playwright;

using NUnit.Framework;

using SkbKontur.DbViewer.Tests.FrontTests.AutoFill;
using SkbKontur.DbViewer.Tests.FrontTests.Pages;

using Validation = SkbKontur.DbViewer.Tests.FrontTests.Controls.Validation;

namespace SkbKontur.DbViewer.Tests.FrontTests.Playwright
{
    public static class AssertionExtensions
    {
        public static Task<T> GetItemWithText<T>(this PwControlList<T> list, Func<T, PwControlBase> f, string text)
            where T : PwControlBase
        {
            return list.Where(x => f(x).Locator.GetByText(text)).Single();
        }

        public static async Task<T> ClickAndGoTo<T>(this PwControlBase control)
            where T : PwPageBase
        {
            await control.Locator.ClickAsync();
            return PwAutoFill.InitializePage<T>(control.Locator.Page);
        }

        public static T GoTo<T>(this PwPageBase page)
            where T : PwPageBase
        {
            return PwAutoFill.InitializePage<T>(page.Page);
        }

        public static async Task Clear(this PwInput input)
        {
            await input.Click();
            await input.Locator.Page.Keyboard.PressAsync("Control+A+Delete");
        }

        public static Task ClearAndInputText(this PwInput input, string value)
        {
            return input.Locator.FillAsync(value);
        }

        public static async Task SelectAndInputText(this PwInput input, string value)
        {
            await input.Click();
            await input.Locator.Page.Keyboard.PressAsync("Control+A");
            await input.Locator.PressSequentiallyAsync(value);
        }

        public static async Task ClearAndInputText(this PwDatePicker datePicker, string value)
        {
            await datePicker.Locator.ClickAsync();
            var input = datePicker.Locator.GetByTestId("InputLikeText__input");
            await input.Page.Keyboard.PressAsync("Home");
            await input.PressSequentiallyAsync(value);
        }

        public static Task WaitCount<T>(this PwControlList<T> list, int count)
            where T : PwControlBase
        {
            return list.Expect().ToHaveCountAsync(count);
        }

        public static async Task<T> Single<T>(this PwControlList<T> list)
            where T : PwControlBase
        {
            await list.WaitCount(1);
            return list[0];
        }

        public static Task WaitCorrect(this PwControlBase control)
        {
            return control.Expect().Not.ToHaveAttributeAsync("data-prop-error", "true");
        }

        public static Task WaitIncorrect(this PwControlBase control)
        {
            return control.Expect().ToHaveAttributeAsync("data-prop-error", "true");
        }

        public static Task WaitPresence(this PwControlBase control)
        {
            return control.Expect().ToBeVisibleAsync();
        }

        public static Task WaitAbsence(this PwControlBase control)
        {
            return control.Expect().Not.ToBeVisibleAsync();
        }

        public static Task WaitText(this PwControlBase control, string value)
        {
            return control.Expect().ToHaveTextAsync(value);
        }

        public static Task WaitText(this PwControlBase control, params string[] values)
        {
            return control.Expect().ToHaveTextAsync(values);
        }

        public static Task WaitTextContains(this PwControlBase control, string value)
        {
            return control.Expect().ToContainTextAsync(value);
        }

        public static async Task WaitItems(this PwSelect select, string[] items)
        {
            await select.Click();
            await select.Items.Expect().ToHaveTextAsync(items);
            await select.Click();
        }

        public static async Task SelectValueByText(this PwSelect select, string value)
        {
            await select.Click();
            await select.Items.Locator.GetByText(value, new LocatorGetByTextOptions {Exact = true}).ClickAsync();
        }

        public static Task ExpectIsOpenedWithMessage(this Validation validation, string message)
        {
            return validation.PopupContent.WaitText(message);
        }

        public static Task Click(this PwControlBase control)
        {
            return control.Locator.ClickAsync();
        }

        public static async Task<Browser> LoginAsSuperUser(this Browser browser)
        {
            await browser.SwitchToUri<PwBusinessObjectsPage>(new Uri("Admin", UriKind.Relative));
            return browser;
        }

        public static async Task<TPage> Refresh<TPage>(this Browser browser, TPage page)
            where TPage : PwPageBase
        {
            await browser.Page.ReloadAsync();
            return browser.GoTo<TPage>();
        }

        public static async Task<TPage> RefreshUntil<TPage>(this Browser browser, TPage page, Func<TPage, Task<bool>> conditionFunc, string cause = null, int timeout = 30000, int waitTimeout = 100)
            where TPage : PwPageBase
        {
            var w = Stopwatch.StartNew();
            if (await conditionFunc(page))
                return page;
            do
            {
                page = await browser.Refresh(page);
                if (await conditionFunc(page))
                    return page;
                Thread.Sleep(waitTimeout);
            } while (w.ElapsedMilliseconds < timeout);
            Assert.Fail(cause ?? $"Не смогли дождаться страницу за {timeout} мс");
            return default;
        }
    }
}