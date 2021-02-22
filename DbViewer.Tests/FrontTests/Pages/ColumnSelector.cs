using SkbKontur.DbViewer.Tests.FrontTests.AutoFill;

using SKBKontur.SeleniumTesting;
using SKBKontur.SeleniumTesting.Controls;

namespace SkbKontur.DbViewer.Tests.FrontTests.Pages
{
    [AutoFillControls]
    public class ColumnSelector : CompoundControl
    {
        public ColumnSelector(ISearchContainer container, ISelector selector)
            : base(container, selector)
        {
        }

        public Input FilterInput { get; set; }
        public ColumnCheckboxes ColumnCheckboxes { get; set; }
        public Link TypesSelectAll { get; set; }
    }
}