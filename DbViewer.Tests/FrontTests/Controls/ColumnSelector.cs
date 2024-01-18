using Microsoft.Playwright;

using SkbKontur.DbViewer.Tests.FrontTests.Playwright;

namespace SkbKontur.DbViewer.Tests.FrontTests.Controls
{
    public class ColumnSelector : ControlBase
    {
        public ColumnSelector(ILocator locator)
            : base(locator)
        {
        }

        public Input FilterInput { get; set; }
        public ColumnCheckboxes ColumnCheckboxes { get; set; }
        public Link TypesSelectAll { get; set; }
    }
}