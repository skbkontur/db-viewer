using SkbKontur.DbViewer.Tests.FrontTests.AutoFill;

using SKBKontur.SeleniumTesting;
using SKBKontur.SeleniumTesting.Controls;

namespace SkbKontur.DbViewer.Tests.FrontTests.Pages
{
    [AutoFillControls]
    public class Accordion : CompoundControl
    {
        public Accordion(ISearchContainer container, ISelector selector)
            : base(container, selector)
        {
        }

        public AccordionRow FindField(string id)
        {
            return this.Find<AccordionRow>().ByTid(id);
        }

        public AccordionToggle FindAccordionToggle(string id)
        {
            return this.Find<AccordionToggle>().ByTid(id);
        }
    }
}