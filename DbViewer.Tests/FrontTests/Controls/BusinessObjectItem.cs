using Microsoft.Playwright;

using SkbKontur.DbViewer.Tests.FrontTests.Playwright;

namespace SkbKontur.DbViewer.Tests.FrontTests.Controls
{
    public class BusinessObjectItem : ControlBase
    {
        public BusinessObjectItem(ILocator locator)
            : base(locator)
        {
        }

        public Link ObjectLink { get; set; }
    }
}