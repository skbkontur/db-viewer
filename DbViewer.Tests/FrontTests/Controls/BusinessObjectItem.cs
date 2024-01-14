using Microsoft.Playwright;

using SkbKontur.DbViewer.Tests.FrontTests.Playwright;

namespace SkbKontur.DbViewer.Tests.FrontTests.Controls
{
    public class BusinessObjectItem : PwControlBase
    {
        public BusinessObjectItem(ILocator locator)
            : base(locator)
        {
        }

        public PwLink ObjectLink { get; set; }
    }
}