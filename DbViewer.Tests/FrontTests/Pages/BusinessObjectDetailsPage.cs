using OpenQA.Selenium.Remote;

using SkbKontur.DbViewer.Tests.FrontTests.AutoFill;
using SkbKontur.DbViewer.Tests.FrontTests.Helpers;

using SKBKontur.SeleniumTesting;
using SKBKontur.SeleniumTesting.Controls;

namespace SkbKontur.DbViewer.Tests.FrontTests.Pages
{
    [AutoFillControls]
    [PageRoute("BusinessObjects/{scopeId}/details?{id}")]
    public class BusinessObjectDetailsPage : PageBase
    {
        public BusinessObjectDetailsPage(RemoteWebDriver webDriver)
            : base(webDriver)
        {
        }

        public Label Header { get; set; }

        public Link Copy { get; set; }
        public Link Delete { get; set; }

        public ConfirmDeleteObjectModal ConfirmDeleteObjectModal { get; set; }

        [LoadingComplete]
        public Accordion RootAccordion { get; set; }
    }
}