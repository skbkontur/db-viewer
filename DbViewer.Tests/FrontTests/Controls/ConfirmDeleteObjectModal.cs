using Microsoft.Playwright;

using SkbKontur.DbViewer.Tests.FrontTests.Playwright;

namespace SkbKontur.DbViewer.Tests.FrontTests.Controls
{
    public class ConfirmDeleteObjectModal : ControlBase
    {
        public ConfirmDeleteObjectModal(ILocator locator)
            : base(locator)
        {
        }

        public Button Delete { get; set; }
        public Button Cancel { get; set; }
    }
}