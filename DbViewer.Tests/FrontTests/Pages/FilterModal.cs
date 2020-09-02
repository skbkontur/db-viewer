using SkbKontur.DbViewer.Tests.FrontTests.AutoFill;

using SKBKontur.SeleniumTesting;
using SKBKontur.SeleniumTesting.Controls;

namespace SkbKontur.DbViewer.Tests.FrontTests.Pages
{
    [AutoFillControls]
    public class FilterModal : ModalBase
    {
        public FilterModal(ISearchContainer container, ISelector selector)
            : base(container, selector)
        {
        }

        public BusinessObjectFilter GetFilter(string name)
        {
            return ObjectFilters.Find<BusinessObjectFilter>().ByTid(name);
        }

        [ChildSelector("##Filter")]
        public ControlList<BusinessObjectFilter> ObjectFilters { get; set; }

        public Button Apply { get; set; }
        public Link Clear { get; set; }
        public Input Id { get; set; }
        public Input ScopeId { get; set; }
    }
}