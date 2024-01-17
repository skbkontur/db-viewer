using Microsoft.Playwright;

using SkbKontur.DbViewer.Tests.FrontTests.AutoFill;
using SkbKontur.DbViewer.Tests.FrontTests.Playwright;

namespace SkbKontur.DbViewer.Tests.FrontTests.Controls
{
    public class AccordionFieldValue : ControlBase
    {
        public AccordionFieldValue(ILocator locator)
            : base(locator)
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