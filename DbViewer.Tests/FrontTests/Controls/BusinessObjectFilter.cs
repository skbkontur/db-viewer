using Microsoft.Playwright;

using SkbKontur.DbViewer.Tests.FrontTests.AutoFill;
using SkbKontur.DbViewer.Tests.FrontTests.Playwright;

namespace SkbKontur.DbViewer.Tests.FrontTests.Controls
{
    public class BusinessObjectFilter : ControlBase
    {
        public BusinessObjectFilter(ILocator locator)
            : base(locator)
        {
        }

        public Label FormCaption { get; set; }
        public Select OperatorSelect { get; set; }
        public Select EnumSelect { get; set; }
        public Select BooleanSelect { get; set; }
        public Input Input { get; set; }

        [Selector("portal=InputValidation")]
        public Validation InputValidation { get; set; }

        public Validation DateTimeValidation { get; set; }
        public DatePicker Date { get; set; }
        public Input Time { get; set; }
        public Input DateTimeInTicks { get; set; }
    }
}