using Microsoft.Playwright;

using SkbKontur.DbViewer.Tests.FrontTests.AutoFill;
using SkbKontur.DbViewer.Tests.FrontTests.Playwright;

namespace SkbKontur.DbViewer.Tests.FrontTests.Controls
{
    public class BusinessObjectGroup : PwControlBase
    {
        public BusinessObjectGroup(ILocator locator)
            : base(locator)
        {
        }

        public PwLabel Name { get; set; }
        public PwLabel IndexedLabel { get; set; }

        [Selector("##ObjectsList ##ObjectItem")]
        public PwControlList<BusinessObjectItem> ObjectsList { get; set; }
    }
}