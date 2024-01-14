using Microsoft.Playwright;

using SkbKontur.DbViewer.Tests.FrontTests.AutoFill;
using SkbKontur.DbViewer.Tests.FrontTests.Playwright;

namespace SkbKontur.DbViewer.Tests.FrontTests.Controls
{
    public class CountDropdown : PwControlBase
    {
        public CountDropdown(ILocator locator)
            : base(locator)
        {
        }

        public PwLink CurrentCount { get; set; }

        [Selector("portal=Popup__root ##PopupContent css=[data-comp-name*='MenuItem']")]
        public PwControlList<PwLabel> Menu { get; set; }
    }
}