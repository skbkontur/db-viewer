using Microsoft.Playwright;

using SkbKontur.DbViewer.Tests.FrontTests.Playwright;

namespace SkbKontur.DbViewer.Tests.FrontTests.Controls
{
    public class AccordionToggle : PwControlBase
    {
        public AccordionToggle(ILocator locator)
            : base(locator)
        {
        }

        public PwButton ToggleButton { get; set; }
    }
}