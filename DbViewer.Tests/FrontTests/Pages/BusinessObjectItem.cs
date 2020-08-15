using SkbKontur.DbViewer.Tests.FrontTests.AutoFill;

using SKBKontur.SeleniumTesting;
using SKBKontur.SeleniumTesting.Controls;

namespace SkbKontur.DbViewer.Tests.FrontTests.Pages
{
    [AutoFillControls]
    public class BusinessObjectItem : CompoundControl
    {
        public BusinessObjectItem(ISearchContainer container, ISelector selector)
            : base(container, selector)
        {
        }

        public Link ObjectLink { get; set; }
    }
}