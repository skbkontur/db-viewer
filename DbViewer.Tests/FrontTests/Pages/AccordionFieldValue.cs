using SkbKontur.DbViewer.Tests.FrontTests.AutoFill;

using SKBKontur.SeleniumTesting;
using SKBKontur.SeleniumTesting.Controls;

namespace SkbKontur.DbViewer.Tests.FrontTests.Pages
{
    [AutoFillControls]
    public class AccordionFieldValue : CompoundControl
    {
        public AccordionFieldValue(ISearchContainer container, ISelector selector)
            : base(container, selector)
        {
        }

        public Link GoToLink { get; set; }

        [Selector("Input")]
        public Input Input { get; set; }

        [Selector("Checkbox")]
        public Checkbox Checkbox { get; set; }

        public Select EnumSelect { get; set; }
        public Select BooleanSelect { get; set; }

        public Link DownloadLink { get; set; }

        public DatePicker Date { get; set; }
        public Input Time { get; set; }
        public Select TimeZoneSelect { get; set; }
        public Label TimeOffsetLabel { get; set; }
    }
}