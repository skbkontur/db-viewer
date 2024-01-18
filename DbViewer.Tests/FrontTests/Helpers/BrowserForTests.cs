using System;
using System.Reflection;
using System.Threading.Tasks;

using Microsoft.Playwright;

using NUnit.Framework;

using SkbKontur.DbViewer.Tests.FrontTests.AutoFill;
using SkbKontur.DbViewer.Tests.FrontTests.Playwright;

namespace SkbKontur.DbViewer.Tests.FrontTests.Helpers
{
    public class BrowserForTests : IAsyncDisposable
    {
        public async Task<TPage> SwitchToUri<TPage>(Uri uri)
            where TPage : PageBase
        {
            await Page.GotoAsync(MakeAbsolute(uri).ToString());
            return AutoFillControls.InitializePage<TPage>(Page);
        }

        public TPage GoTo<TPage>()
            where TPage : PageBase
        {
            var newPage = AutoFillControls.InitializePage<TPage>(Page);
            return newPage;
        }

        public async ValueTask DisposeAsync()
        {
            if (context != null)
            {
                await context.Tracing.StopAsync(new TracingStopOptions
                    {
                        Path = $"{TestContext.CurrentContext.TestDirectory}/out/{TestContext.CurrentContext.Test.Name}.zip"
                    });
            }

            if (page != null)
                await page.CloseAsync();

            if (context != null)
            {
                await context.CloseAsync();
            }
        }

        private Uri MakeAbsolute(Uri uri)
        {
            return uri.IsAbsoluteUri ? uri : new Uri(new Uri(baseUrl), uri);
        }

        public IPage Page
        {
            get
            {
                if (page != null)
                    return page;

                context = PlaywrightSetup.Browser.NewContextAsync(new BrowserNewContextOptions
                    {
                        Locale = "en-US",
                        TimezoneId = "Europe/London"
                    }).GetAwaiter().GetResult();
                context.Tracing.StartAsync(new TracingStartOptions
                    {
                        Screenshots = true,
                        Snapshots = true,
                        Sources = true,
                        Name = TestContext.CurrentContext.Test.Name
                    }).GetAwaiter().GetResult();

                return page = context.NewPageAsync().GetAwaiter().GetResult();
            }
        }

        private const string baseUrl = "http://localhost:5000/";

        private IPage? page;
        private IBrowserContext? context;
    }

    public static class AttributeNavigationExtensions
    {
        public static ILocatorAssertions Expect(this ControlBase controlBase)
        {
            return Assertions.Expect(controlBase.Locator);
        }

        public static Task<TPage> SwitchTo<TPage>(this BrowserForTests browser, params string[] templateParameters)
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