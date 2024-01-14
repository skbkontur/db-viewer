using Microsoft.Playwright;

using SkbKontur.DbViewer.Tests.FrontTests.Playwright;

namespace SkbKontur.DbViewer.Tests.FrontTests.Controls
{
    public class ColumnSelector : PwControlBase
    {
        public ColumnSelector(ILocator locator)
            : base(locator)
        {
        }

        public PwInput FilterInput { get; set; }
        public ColumnCheckboxes ColumnCheckboxes { get; set; }
        public PwLink TypesSelectAll { get; set; }
    }
}