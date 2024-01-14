using Microsoft.Playwright;

using SkbKontur.DbViewer.Tests.FrontTests.AutoFill;
using SkbKontur.DbViewer.Tests.FrontTests.Playwright;

namespace SkbKontur.DbViewer.Tests.FrontTests.Controls
{
    public class BusinessObjectFilter : PwControlBase
    {
        public BusinessObjectFilter(ILocator locator)
            : base(locator)
        {
        }

        public PwLabel FormCaption { get; set; }
        public PwSelect OperatorSelect { get; set; }
        public PwSelect EnumSelect { get; set; }
        public PwSelect BooleanSelect { get; set; }
        public PwInput Input { get; set; }

        [Selector("portal=InputValidation")]
        public Validation InputValidation { get; set; }

        public Validation DateTimeValidation { get; set; }
        public PwDatePicker Date { get; set; }
        public PwInput Time { get; set; }
        public PwInput DateTimeInTicks { get; set; }
    }
}