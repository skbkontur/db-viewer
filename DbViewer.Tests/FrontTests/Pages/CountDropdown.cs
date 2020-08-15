using SkbKontur.DbViewer.Tests.FrontTests.AutoFill;

using SKBKontur.SeleniumTesting;
using SKBKontur.SeleniumTesting.Controls;

namespace SkbKontur.DbViewer.Tests.FrontTests.Pages
{
    [AutoFillControls]
    public class CountDropdown : CompoundControl
    {
        public CountDropdown(ISearchContainer container, ISelector selector)
            : base(container, selector)
        {
        }

        public Link CurrentCount { get; set; }

        [Selector("Portal:portal ##PopupContent")]
        public Menu Menu { get; set; }
    }
}