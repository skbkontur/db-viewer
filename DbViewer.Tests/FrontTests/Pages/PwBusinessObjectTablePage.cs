using Microsoft.Playwright;

using SkbKontur.DbViewer.Tests.FrontTests.AutoFill;
using SkbKontur.DbViewer.Tests.FrontTests.Helpers;
using SkbKontur.DbViewer.Tests.FrontTests.Playwright;

namespace SkbKontur.DbViewer.Tests.FrontTests.Pages
{
    [PageRoute("BusinessObjects/{id}")]
    public class PwBusinessObjectTablePage : PwPageBase
    {
        public PwBusinessObjectTablePage(IPage page)
            : base(page)
        {
        }

        public PwLabel Header { get; set; }

        public PwLink GoBack { get; set; }
        public PwLabel NothingFound { get; set; }

        public PwLabel ItemsCountInfo { get; set; }

        public PwLink OpenFilter { get; set; }

        [Selector("portal=FilterModal")]
        public Controls.FilterModal FilterModal { get; set; }

        public Controls.DownloadLimitModal DownloadLimitModal { get; set; }

        public Controls.CountDropdown CountDropdown { get; set; }
        public PwLink ClearFilter { get; set; }
        public PwLink FieldSettings { get; set; }
        public PwLink DownloadLink { get; set; }

        [Selector("portal=Tooltip__root ##ColumnSelector")]
        public Controls.ColumnSelector ColumnSelector { get; set; }

        [Selector("portal=ConfirmDeleteObjectModal")]
        public Controls.ConfirmDeleteObjectModal ConfirmDeleteObjectModal { get; set; }

        public Controls.BusinessObjectTableHeader TableHeader { get; set; }

        [Selector("##Body ##Row")]
        public PwControlList<Controls.BusinessObjectTableRow> BusinessObjectItems { get; set; }

        public Controls.Paging Paging { get; set; }
    }
}