using Microsoft.Playwright;

using SkbKontur.DbViewer.Tests.FrontTests.Playwright;

namespace SkbKontur.DbViewer.Tests.FrontTests.Controls
{
    public class DownloadLimitModal : ControlBase
    {
        public DownloadLimitModal(ILocator locator)
            : base(locator)
        {
        }

        public Label Header { get; set; }
        public Label Body { get; set; }

        public Button Cancel { get; set; }
    }
}