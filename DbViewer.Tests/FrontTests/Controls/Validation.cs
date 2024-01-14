using Microsoft.Playwright;

using SkbKontur.DbViewer.Tests.FrontTests.Playwright;

namespace SkbKontur.DbViewer.Tests.FrontTests.Controls
{
    public class Validation : PwControlBase
    {
        public Validation(ILocator locator)
            : base(locator)
        {
        }

        public PwLabel PopupContent { get; set; }
    }
}