using SkbKontur.DbViewer.Tests.FrontTests.AutoFill;

using SKBKontur.SeleniumTesting;
using SKBKontur.SeleniumTesting.Controls;

namespace SkbKontur.DbViewer.Tests.FrontTests.Pages
{
    [AutoFillControls]
    public class AccordionRow : CompoundControl
    {
        public AccordionRow(ISearchContainer container, ISelector selector)
            : base(container, selector)
        {
        }

        public Label Key { get; set; }

        public Link GoToLink { get; set; }

        public AccordionFieldValue FieldValue { get; set; }
        public Label Value { get; set; }

        public Button Edit { get; set; }
        public Button Save { get; set; }
        public Button Cancel { get; set; }
    }
}