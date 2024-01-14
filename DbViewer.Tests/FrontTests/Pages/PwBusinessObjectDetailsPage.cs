using Microsoft.Playwright;

using SkbKontur.DbViewer.Tests.FrontTests.Helpers;
using SkbKontur.DbViewer.Tests.FrontTests.Playwright;

namespace SkbKontur.DbViewer.Tests.FrontTests.Pages
{
    [PageRoute("BusinessObjects/{scopeId}/details?{id}")]
    public class PwBusinessObjectDetailsPage : PwPageBase
    {
        public PwBusinessObjectDetailsPage(IPage page)
            : base(page)
        {
        }

        public PwLabel Header { get; set; }

        public PwLink Copy { get; set; }
        public PwLink Delete { get; set; }

        public Controls.ConfirmDeleteObjectModal ConfirmDeleteObjectModal { get; set; }

        public Controls.Accordion RootAccordion { get; set; }
    }
}