using Microsoft.Playwright;

using SkbKontur.DbViewer.Tests.FrontTests.AutoFill;
using SkbKontur.DbViewer.Tests.FrontTests.Playwright;

namespace SkbKontur.DbViewer.Tests.FrontTests.Controls
{
    public class AccordionFieldValue : PwControlBase
    {
        public AccordionFieldValue(ILocator locator)
            : base(locator)
        {
        }

        public PwLink GoToLink { get; set; }

        [Selector("Input")]
        public PwInput Input { get; set; }

        [Selector("Checkbox")]
        public PwCheckbox Checkbox { get; set; }

        public PwSelect EnumSelect { get; set; }
        public PwSelect BooleanSelect { get; set; }

        public PwLink DownloadLink { get; set; }

        public PwDatePicker Date { get; set; }
        public PwInput Time { get; set; }
        public PwSelect TimeZoneSelect { get; set; }
        public PwLabel TimeOffsetLabel { get; set; }
    }
}