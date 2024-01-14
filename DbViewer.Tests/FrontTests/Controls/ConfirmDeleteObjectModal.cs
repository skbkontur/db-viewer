using Microsoft.Playwright;

using SkbKontur.DbViewer.Tests.FrontTests.Playwright;

namespace SkbKontur.DbViewer.Tests.FrontTests.Controls
{
    public class ConfirmDeleteObjectModal : PwControlBase
    {
        public ConfirmDeleteObjectModal(ILocator locator)
            : base(locator)
        {
        }

        public PwButton Delete { get; set; }
        public PwButton Cancel { get; set; }
    }
}