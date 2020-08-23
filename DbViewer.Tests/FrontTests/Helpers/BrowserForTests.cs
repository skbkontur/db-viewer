using System;
using System.Diagnostics;
using System.Drawing;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Reflection;
using System.Threading;

using NUnit.Framework;

using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Remote;

using SKBKontur.SeleniumTesting;

using Cookie = OpenQA.Selenium.Cookie;

namespace SkbKontur.DbViewer.Tests.FrontTests.Helpers
{
    public class BrowserForTests : IDisposable
    {
        public void Dispose()
        {
            WebDriver.Dispose();
        }

        public TPage SwitchToUri<TPage>(Uri uri)
        {
            WebDriver.Navigate().GoToUrl(MakeAbsolute(uri));
            var newPage = InitializePage<TPage>();
            return newPage;
        }

        public TPage GoTo<TPage>()
        {
            var newPage = InitializePage<TPage>();
            return newPage;
        }

        private TPage InitializePage<TPage>()
        {
            var newPage = (TPage)Activator.CreateInstance(typeof(TPage), WebDriver);
            (newPage as PageBase).WaitLoaded();
            return newPage;
        }

        private Uri MakeAbsolute(Uri uri)
        {
            return uri.IsAbsoluteUri ? uri : new Uri(new Uri(BaseUrl), uri);
        }

        private static IPAddress GetLocalIp()
        {
            return Dns.GetHostAddresses(Dns.GetHostName()).First(x => x.AddressFamily == AddressFamily.InterNetwork);
        }

        public RemoteWebDriver WebDriver
        {
            get
            {
                if (webDriver != null) return webDriver;

                var wdHub = "http://localhost:4444/wd/hub";
                ChromeOptions options = new ChromeOptions();

                options.AddAdditionalCapability(CapabilityType.Platform, "Windows 10", true);
                options.AddAdditionalCapability("name", TestContext.CurrentContext.Test.Name, true);
                options.AddAdditionalCapability("maxDuration", 10800, true);

                var caps = (DesiredCapabilities)options.ToCapabilities();
                caps.SetCapability("enableVNC", true);

                webDriver = new RemoteWebDriver(new Uri(wdHub), caps, TimeSpan.FromMinutes(1));
                webDriver.Manage().Window.Size = new Size(1280, 1024);
                return webDriver;
            }
        }

        private string BaseUrl { get; } = $"http://{GetLocalIp()}:8080/";

        private RemoteWebDriver webDriver;
    }

    public static class AttributeNavigationExtensions
    {
        public static TPage Refresh<TPage>(this BrowserForTests browser, TPage page)
            where TPage : PageBase
        {
            browser.WebDriver.Navigate().Refresh();
            return browser.GoTo<TPage>();
        }

        public static TPage RefreshUntil<TPage>(this BrowserForTests browser, TPage page, Func<TPage, bool> conditionFunc, string cause = null, int timeout = 65000, int waitTimeout = 100)
            where TPage : PageBase
        {
            var w = Stopwatch.StartNew();
            if (conditionFunc(page))
                return page;
            do
            {
                page = browser.Refresh(page);
                if (conditionFunc(page))
                    return page;
                Thread.Sleep(waitTimeout);
            } while (w.ElapsedMilliseconds < timeout);
            Assert.Fail(cause ?? $"Не смогли дождаться страницу за {timeout} мс");
            return default;
        }

        public static BrowserForTests LoginAsSuperUser(this BrowserForTests browser)
        {
            browser.WebDriver.Manage().Cookies.AddCookie(new Cookie("isSuperUser", "true", "/"));
            return browser;
        }

        public static TPage SwitchTo<TPage>(this BrowserForTests browser, params string[] templateParameters)
            where TPage : PageBase
        {
            return browser.SwitchToUri<TPage>(new Uri(GetPageRoute<TPage>(templateParameters), UriKind.Relative));
        }

        private static string GetPageRoute<TPage>(string[] templateParameters)
        {
            foreach (var attribute in typeof(TPage).GetCustomAttributes<PageRouteAttribute>())
            {
                var route = attribute.Route;
                if (templateParameters.Length == 0 && !route.Contains("{id}") && !route.Contains("{scopeId}"))
                    return route;
                if (templateParameters.Length == 1 && route.Contains("{id}") && !route.Contains("{scopeId}"))
                    return route.Replace("{id}", templateParameters[0]);
                if (templateParameters.Length == 2 && route.Contains("{id}") && route.Contains("{scopeId}"))
                    return route.Replace("{scopeId}", templateParameters[0]).Replace("{id}", templateParameters[1]);
                if (templateParameters.Length == 3 && route.Contains("{scopeId}") && route.Contains("{id}") && route.Contains("{versionId}"))
                    return route
                           .Replace("{scopeId}", templateParameters[0])
                           .Replace("{id}", templateParameters[1])
                           .Replace("{versionId}", templateParameters[2]);
            }
            throw new InvalidOperationException($"Corresponding PageRoute attribute with {templateParameters.Length} arguments not found for {typeof(TPage).Name}");
        }
    }
}