using Microsoft.Playwright;

using SkbKontur.DbViewer.Tests.FrontTests.AutoFill;
using SkbKontur.DbViewer.Tests.FrontTests.Playwright;

namespace SkbKontur.DbViewer.Tests.FrontTests.Controls
{
    public class Accordion : PwControlBase
    {
        public Accordion(ILocator locator)
            : base(locator)
        {
        }

        public AccordionRow FindField(string id)
        {
            var row = new AccordionRow(Locator.GetByTestId(id));
            PwAutoFill.InitializeControls(row, Locator.Page, row.Locator);

            return row;
        }

        public AccordionToggle FindAccordionToggle(string id)
        {
            var toggle = new AccordionToggle(Locator.GetByTestId(id));
            PwAutoFill.InitializeControls(toggle, Locator.Page, toggle.Locator);

            return toggle;
        }
    }
}