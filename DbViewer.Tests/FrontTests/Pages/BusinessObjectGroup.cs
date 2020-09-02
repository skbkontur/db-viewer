using SkbKontur.DbViewer.Tests.FrontTests.AutoFill;

using SKBKontur.SeleniumTesting;
using SKBKontur.SeleniumTesting.Controls;

namespace SkbKontur.DbViewer.Tests.FrontTests.Pages
{
    [AutoFillControls]
    public class BusinessObjectGroup : CompoundControl
    {
        public BusinessObjectGroup(ISearchContainer container, ISelector selector)
            : base(container, selector)
        {
        }

        public Label Name { get; set; }
        public Label IndexedLabel { get; set; }

        [ChildSelector("##ObjectItem")]
        public ControlList<BusinessObjectItem> ObjectsList { get; set; }
    }
}