using Microsoft.Playwright;

using SkbKontur.DbViewer.Tests.FrontTests.Playwright;

namespace SkbKontur.DbViewer.Tests.FrontTests.Controls
{
    public class Validation : ControlBase
    {
        public Validation(ILocator locator)
            : base(locator)
        {
        }

        public Label PopupContent { get; set; }
    }
}