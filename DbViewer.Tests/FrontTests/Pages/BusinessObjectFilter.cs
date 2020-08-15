using SkbKontur.DbViewer.Tests.FrontTests.AutoFill;

using SKBKontur.SeleniumTesting;
using SKBKontur.SeleniumTesting.Controls;

namespace SkbKontur.DbViewer.Tests.FrontTests.Pages
{
    [AutoFillControls]
    public class BusinessObjectFilter : CompoundControl
    {
        public BusinessObjectFilter(ISearchContainer container, ISelector selector)
            : base(container, selector)
        {
        }

        public Label FormCaption { get; set; }
        public Select OperatorSelect { get; set; }
        public Select EnumSelect { get; set; }
        public Select BooleanSelect { get; set; }
        public Input Input { get; set; }
        public Validation InputValidation { get; set; }
        public Validation DateTimeValidation { get; set; }
        public DatePicker Date { get; set; }
        public Input Time { get; set; }
        public Input DateTimeInTicks { get; set; }
    }
}