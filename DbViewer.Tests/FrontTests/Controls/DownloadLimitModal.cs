using Microsoft.Playwright;

using SkbKontur.DbViewer.Tests.FrontTests.Playwright;

namespace SkbKontur.DbViewer.Tests.FrontTests.Controls
{
    public class DownloadLimitModal : PwControlBase
    {
        public DownloadLimitModal(ILocator locator)
            : base(locator)
        {
        }

        public PwLabel Header { get; set; }
        public PwLabel Body { get; set; }

        public PwButton Cancel { get; set; }
    }
}