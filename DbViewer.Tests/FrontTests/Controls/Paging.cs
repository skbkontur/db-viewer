using Microsoft.Playwright;

using SkbKontur.DbViewer.Tests.FrontTests.AutoFill;
using SkbKontur.DbViewer.Tests.FrontTests.Playwright;

namespace SkbKontur.DbViewer.Tests.FrontTests.Controls
{
    public class Paging : PwControlBase
    {
        public Paging(ILocator locator)
            : base(locator)
        {
        }

        [Selector("##Paging__pageLinkWrapper")]
        public PwControlList<PwLabel> Pages { get; set; }

        [Selector("##Paging__forwardLink")]
        public PwLink Forward { get; set; }
    }
}