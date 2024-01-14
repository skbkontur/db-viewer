using Microsoft.Playwright;

using SkbKontur.DbViewer.Tests.FrontTests.Playwright;

namespace SkbKontur.DbViewer.Tests.FrontTests.Controls
{
    public class AccordionRow : PwControlBase
    {
        public AccordionRow(ILocator locator)
            : base(locator)
        {
        }

        public PwLabel Key { get; set; }

        public PwLink GoToLink { get; set; }

        public AccordionFieldValue FieldValue { get; set; }
        public PwLabel Value { get; set; }

        public PwButton Edit { get; set; }
        public PwButton Save { get; set; }
        public PwButton Cancel { get; set; }
    }
}