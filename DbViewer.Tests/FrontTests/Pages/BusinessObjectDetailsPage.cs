using Microsoft.Playwright;

using SkbKontur.DbViewer.Tests.FrontTests.Controls;
using SkbKontur.DbViewer.Tests.FrontTests.Helpers;
using SkbKontur.DbViewer.Tests.FrontTests.Playwright;

namespace SkbKontur.DbViewer.Tests.FrontTests.Pages
{
    [PageRoute("BusinessObjects/{scopeId}/details?{id}")]
    public class BusinessObjectDetailsPage : PageBase
    {
        public BusinessObjectDetailsPage(IPage page)
            : base(page)
        {
        }

        public Label Header { get; set; }

        public Link Copy { get; set; }
        public Link Delete { get; set; }

        public ConfirmDeleteObjectModal ConfirmDeleteObjectModal { get; set; }

        public Accordion RootAccordion { get; set; }
    }
}