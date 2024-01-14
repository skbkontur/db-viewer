using Microsoft.Playwright;

using SkbKontur.DbViewer.Tests.FrontTests.AutoFill;

namespace SkbKontur.DbViewer.Tests.FrontTests.Playwright
{
    public class PwSelect : PwControlBase
    {
        public PwSelect(ILocator locator)
            : base(locator)
        {
        }

        [Selector("portal=Select__menu ##MenuItem__root")]
        public PwControlList<PwLabel> Items { get; set; }
    }
}