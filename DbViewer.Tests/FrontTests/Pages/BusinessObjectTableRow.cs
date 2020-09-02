using SkbKontur.DbViewer.Tests.FrontTests.AutoFill;

using SKBKontur.SeleniumTesting;
using SKBKontur.SeleniumTesting.Controls;

namespace SkbKontur.DbViewer.Tests.FrontTests.Pages
{
    [AutoFillControls]
    public class BusinessObjectTableRow : CompoundControl
    {
        public BusinessObjectTableRow(ISearchContainer container, ISelector selector)
            : base(container, selector)
        {
        }

        public Link Details { get; set; }
        public Link Delete { get; set; }
        public Label Id { get; set; }
        public Label ScopeId { get; set; }

        public Label FindColumn(string tid)
        {
            return this.Find<Label>().ByTid(tid);
        }
    }
}