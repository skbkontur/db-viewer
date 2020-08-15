using SkbKontur.DbViewer.Tests.FrontTests.AutoFill;

using SKBKontur.SeleniumTesting;
using SKBKontur.SeleniumTesting.Controls;

namespace SkbKontur.DbViewer.Tests.FrontTests.Pages
{
    [AutoFillControls]
    public class BusinessObjectTableHeader : CompoundControl
    {
        public BusinessObjectTableHeader(ISearchContainer container, ISelector selector)
            : base(container, selector)
        {
        }

        public void SortByColumn(string tid)
        {
            this.Find<Button>().ByTid(tid).Click();
        }
    }
}