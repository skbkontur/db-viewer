using Microsoft.Playwright;

using SkbKontur.DbViewer.Tests.FrontTests.Playwright;

namespace SkbKontur.DbViewer.Tests.FrontTests.Controls
{
    public class AccordionToggle : ControlBase
    {
        public AccordionToggle(ILocator locator)
            : base(locator)
        {
        }

        public Button ToggleButton { get; set; }
    }
}