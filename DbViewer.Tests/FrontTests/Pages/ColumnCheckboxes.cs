using SKBKontur.SeleniumTesting;
using SKBKontur.SeleniumTesting.Controls;

namespace SkbKontur.DbViewer.Tests.FrontTests.Pages
{
    public class ColumnCheckboxes : CompoundControl
    {
        public ColumnCheckboxes(ISearchContainer container, ISelector selector)
            : base(container, selector)
        {
        }

        public Checkbox GetCheckbox(string tid)
        {
            return this.Find<Checkbox>().ByTid(tid);
        }
    }
}