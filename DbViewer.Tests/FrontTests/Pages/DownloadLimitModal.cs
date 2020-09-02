using SkbKontur.DbViewer.Tests.FrontTests.AutoFill;

using SKBKontur.SeleniumTesting;
using SKBKontur.SeleniumTesting.Controls;

namespace SkbKontur.DbViewer.Tests.FrontTests.Pages
{
    [AutoFillControls]
    public class DownloadLimitModal : ModalBase
    {
        public DownloadLimitModal(ISearchContainer container, ISelector selector)
            : base(container, selector)
        {
        }

        public Label Header { get; set; }
        public Label Body { get; set; }

        public Button Cancel { get; set; }
    }
}