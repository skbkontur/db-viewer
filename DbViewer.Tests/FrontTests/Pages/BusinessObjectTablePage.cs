using Microsoft.Playwright;

using SkbKontur.DbViewer.Tests.FrontTests.AutoFill;
using SkbKontur.DbViewer.Tests.FrontTests.Controls;
using SkbKontur.DbViewer.Tests.FrontTests.Helpers;
using SkbKontur.DbViewer.Tests.FrontTests.Playwright;

namespace SkbKontur.DbViewer.Tests.FrontTests.Pages
{
    [PageRoute("BusinessObjects/{id}")]
    public class BusinessObjectTablePage : PageBase
    {
        public BusinessObjectTablePage(IPage page)
            : base(page)
        {
        }

        public Label Header { get; set; }

        public Link GoBack { get; set; }
        public Label NothingFound { get; set; }

        public Label ItemsCountInfo { get; set; }

        public Link OpenFilter { get; set; }

        [Selector("portal=FilterModal")]
        public FilterModal FilterModal { get; set; }

        public DownloadLimitModal DownloadLimitModal { get; set; }

        public CountDropdown CountDropdown { get; set; }
        public Link ClearFilter { get; set; }
        public Link FieldSettings { get; set; }
        public Link DownloadLink { get; set; }

        [Selector("portal=Tooltip__root ##ColumnSelector")]
        public ColumnSelector ColumnSelector { get; set; }

        [Selector("portal=ConfirmDeleteObjectModal")]
        public ConfirmDeleteObjectModal ConfirmDeleteObjectModal { get; set; }

        public BusinessObjectTableHeader TableHeader { get; set; }

        [Selector("##Body ##Row")]
        public ControlList<BusinessObjectTableRow> BusinessObjectItems { get; set; }

        public Paging Paging { get; set; }
    }
}