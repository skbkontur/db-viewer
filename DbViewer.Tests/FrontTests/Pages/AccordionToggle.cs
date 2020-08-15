using SkbKontur.DbViewer.Tests.FrontTests.AutoFill;

using SKBKontur.SeleniumTesting;
using SKBKontur.SeleniumTesting.Controls;

namespace SkbKontur.DbViewer.Tests.FrontTests.Pages
{
    [AutoFillControls]
    public class AccordionToggle : CompoundControl
    {
        public AccordionToggle(ISearchContainer container, ISelector selector)
            : base(container, selector)
        {
        }

        public Button ToggleButton { get; set; }
    }
}