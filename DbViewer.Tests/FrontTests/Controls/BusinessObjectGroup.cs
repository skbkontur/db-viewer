using Microsoft.Playwright;

using SkbKontur.DbViewer.Tests.FrontTests.AutoFill;
using SkbKontur.DbViewer.Tests.FrontTests.Playwright;

namespace SkbKontur.DbViewer.Tests.FrontTests.Controls
{
    public class BusinessObjectGroup : ControlBase
    {
        public BusinessObjectGroup(ILocator locator)
            : base(locator)
        {
        }

        public Label Name { get; set; }
        public Label IndexedLabel { get; set; }

        [Selector("##ObjectsList ##ObjectItem")]
        public ControlList<BusinessObjectItem> ObjectsList { get; set; }
    }
}