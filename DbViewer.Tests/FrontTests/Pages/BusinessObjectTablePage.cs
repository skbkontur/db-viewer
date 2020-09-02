using OpenQA.Selenium.Remote;

using SkbKontur.DbViewer.Tests.FrontTests.AutoFill;
using SkbKontur.DbViewer.Tests.FrontTests.Helpers;

using SKBKontur.SeleniumTesting;
using SKBKontur.SeleniumTesting.Controls;

namespace SkbKontur.DbViewer.Tests.FrontTests.Pages
{
    [AutoFillControls]
    [PageRoute("BusinessObjects/{id}")]
    public class BusinessObjectTablePage : PageBase
    {
        public BusinessObjectTablePage(RemoteWebDriver webDriver)
            : base(webDriver)
        {
        }

        [LoadingComplete]
        public Label Header { get; set; }

        public Link GoBack { get; set; }
        public Label NothingFound { get; set; }

        public Label ItemsCountInfo { get; set; }

        public Link OpenFilter { get; set; }
        public FilterModal FilterModal { get; set; }
        public DownloadLimitModal DownloadLimitModal { get; set; }

        public CountDropdown CountDropdown { get; set; }
        public Link ClearFilter { get; set; }
        public Link FieldSettings { get; set; }
        public Link DownloadLink { get; set; }

        public ConfirmDeleteObjectModal ConfirmDeleteObjectModal { get; set; }

        public BusinessObjectTableHeader TableHeader { get; set; }

        [Selector("##Body")]
        [ChildSelector("##Row")]
        public ControlList<BusinessObjectTableRow> BusinessObjectItems { get; set; }

        public Paging Paging { get; set; }
    }
}