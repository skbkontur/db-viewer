using System;
using System.Diagnostics;
using System.Threading;
using System.Threading.Tasks;

using Microsoft.Playwright;

using NUnit.Framework;

using SkbKontur.DbViewer.Tests.FrontTests.AutoFill;
using SkbKontur.DbViewer.Tests.FrontTests.Controls;
using SkbKontur.DbViewer.Tests.FrontTests.Pages;
using SkbKontur.DbViewer.Tests.FrontTests.Playwright;

namespace SkbKontur.DbViewer.Tests.FrontTests.Helpers
{
    public static class AssertionExtensions
    {
        public static Task<T> GetItemWithText<T>(this ControlList<T> list, Func<T, ControlBase> f, string text)
            where T : ControlBase
        {
            return list.Where(x => f(x).Locator.GetByText(text)).Single();
        }

        public static async Task<T> ClickAndGoTo<T>(this ControlBase control)
            where T : PageBase
        {
            await control.Locator.ClickAsync();
            return AutoFillControls.InitializePage<T>(control.Locator.Page);
        }

        public static T GoTo<T>(this PageBase page)
            where T : PageBase
        {
            return AutoFillControls.InitializePage<T>(page.Page);
        }

        public static async Task Clear(this Input input)
        {
            await input.Click();
            await input.Locator.Page.Keyboard.PressAsync("Control+A+Delete");
        }

        public static Task ClearAndInputText(this Input input, string value)
        {
            return input.Locator.FillAsync(value);
        }

        public static async Task SelectAndInputText(this Input input, string value)
        {
            await input.Click();
            await input.Locator.Page.Keyboard.PressAsync("Control+A");
            await input.Locator.PressSequentiallyAsync(value);
        }

        public static async Task ClearAndInputText(this DatePicker datePicker, string value)
        {
            await datePicker.Locator.ClickAsync();
            var input = datePicker.Locator.GetByTestId("InputLikeText__input");
            await input.Page.Keyboard.PressAsync("Home");
            await input.PressSequentiallyAsync(value);
        }

        public static Task WaitCount<T>(this ControlList<T> list, int count)
            where T : ControlBase
        {
            return list.Expect().ToHaveCountAsync(count);
        }

        public static async Task<T> Single<T>(this ControlList<T> list)
            where T : ControlBase
        {
            await list.WaitCount(1);
            return list[0];
        }

        public static Task WaitCorrect(this ControlBase control)
        {
            return control.Expect().Not.ToHaveAttributeAsync("data-prop-error", "true");
        }

        public static Task WaitIncorrect(this ControlBase control)
        {
            return control.Expect().ToHaveAttributeAsync("data-prop-error", "true");
        }

        public static Task WaitPresence(this ControlBase control)
        {
            return control.Expect().ToBeVisibleAsync();
        }

        public static Task WaitAbsence(this ControlBase control)
        {
            return control.Expect().Not.ToBeVisibleAsync();
        }

        public static Task WaitText(this ControlBase control, string value)
        {
            return control.Expect().ToHaveTextAsync(value);
        }

        public static Task WaitText(this ControlBase control, params string[] values)
        {
            return control.Expect().ToHaveTextAsync(values);
        }

        public static Task WaitTextContains(this ControlBase control, string value)
        {
            return control.Expect().ToContainTextAsync(value);
        }

        public static async Task WaitItems(this Select select, string[] items)
        {
            await select.Click();
            await select.Items.Expect().ToHaveTextAsync(items);
            await select.Click();
        }

        public static async Task SelectValueByText(this Select select, string value)
        {
            await select.Click();
            await select.Items.Locator.GetByText(value, new LocatorGetByTextOptions {Exact = true}).ClickAsync();
        }

        public static Task ExpectIsOpenedWithMessage(this Validation validation, string message)
        {
            return validation.PopupContent.WaitText(message);
        }

        public static Task Click(this ControlBase control)
        {
            return control.Locator.ClickAsync();
        }

        public static async Task<BrowserForTests> LoginAsSuperUser(this BrowserForTests browser)
        {
            await browser.SwitchToUri<BusinessObjectsPage>(new Uri("Admin", UriKind.Relative));
            return browser;
        }

        public static async Task<TPage> Refresh<TPage>(this BrowserForTests browser, TPage page)
            where TPage : PageBase
        {
            await browser.Page.ReloadAsync();
            return browser.GoTo<TPage>();
        }

        public static async Task<TPage> RefreshUntil<TPage>(this BrowserForTests browser, TPage page, Func<TPage, Task<bool>> conditionFunc, string cause = null, int timeout = 30000, int waitTimeout = 100)
            where TPage : PageBase
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