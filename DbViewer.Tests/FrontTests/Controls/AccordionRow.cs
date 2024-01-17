using Microsoft.Playwright;

using SkbKontur.DbViewer.Tests.FrontTests.Playwright;

namespace SkbKontur.DbViewer.Tests.FrontTests.Controls
{
    public class AccordionRow : ControlBase
    {
        public AccordionRow(ILocator locator)
            : base(locator)
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