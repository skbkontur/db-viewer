using Microsoft.Playwright;

using SkbKontur.DbViewer.Tests.FrontTests.AutoFill;

namespace SkbKontur.DbViewer.Tests.FrontTests.Playwright
{
    public class Select : ControlBase
    {
        public Select(ILocator locator)
            : base(locator)
        {
        }

        [Selector("portal=Select__menu ##MenuItem__root")]
        public ControlList<Label> Items { get; set; }
    }
}