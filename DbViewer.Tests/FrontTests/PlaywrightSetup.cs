using System.Threading.Tasks;

using Microsoft.Playwright;

using NUnit.Framework;

namespace SkbKontur.DbViewer.Tests.FrontTests
{
    [SetUpFixture]
    public class PlaywrightSetup
    {
        public static IPlaywright Playwright { get; private set; }
        public static IBrowser Browser { get; private set; }

        [OneTimeSetUp]
        public async Task SetUp()
        {
            Playwright = await Microsoft.Playwright.Playwright.CreateAsync();
            Playwright.Selectors.SetTestIdAttribute("data-tid");
            await Playwright.Selectors.RegisterAsync("portal", new SelectorsRegisterOptions
                {
                    Script = @"{
                       query(root, selector) {
                         const portal = root.querySelector(`noscript[data-tid='${selector}']`);
                         const id = portal?.getAttribute('data-render-container-id');
                         return id && document.querySelector(`[data-rendered-container-id='${id}']`);
                       },

                       queryAll(root, selector) {
                         const portal = root.querySelector(`noscript[data-tid='${selector}']`);
                         const id = portal?.getAttribute('data-render-container-id');
                         return id == null ? [] : [document.querySelector(`[data-rendered-container-id='${id}']`)];
                       }
                     }"
                });

            Browser = await Playwright.Chromium.LaunchAsync();
        }

        [OneTimeTearDown]
        public async Task TearDown()
        {
            await Browser.DisposeAsync();
            Playwright.Dispose();
        }
    }
}