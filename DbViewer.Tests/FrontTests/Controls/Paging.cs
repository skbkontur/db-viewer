using Microsoft.Playwright;

using SkbKontur.DbViewer.Tests.FrontTests.AutoFill;
using SkbKontur.DbViewer.Tests.FrontTests.Playwright;

namespace SkbKontur.DbViewer.Tests.FrontTests.Controls
{
    public class Paging : ControlBase
    {
        public Paging(ILocator locator)
            : base(locator)
        {
        }

        [Selector("##Paging__pageLinkWrapper")]
        public ControlList<Label> Pages { get; set; }

        [Selector("##Paging__forwardLink")]
        public Link Forward { get; set; }
    }
}