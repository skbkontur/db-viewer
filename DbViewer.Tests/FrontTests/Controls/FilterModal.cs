using System.Threading.Tasks;

using Microsoft.Playwright;

using SkbKontur.DbViewer.Tests.FrontTests.AutoFill;
using SkbKontur.DbViewer.Tests.FrontTests.Helpers;
using SkbKontur.DbViewer.Tests.FrontTests.Playwright;

namespace SkbKontur.DbViewer.Tests.FrontTests.Controls
{
    public class FilterModal : ControlBase
    {
        public FilterModal(ILocator locator)
            : base(locator)
        {
        }

        public Task<BusinessObjectFilter> GetFilter(string name)
        {
            return ObjectFilters.Where(x => x.Locator.Page.GetByTestId(name)).Single();
        }

        [Selector("##ObjectFilters ##Filter")]
        public ControlList<BusinessObjectFilter> ObjectFilters { get; set; }

        public Button Apply { get; set; }
        public Link Clear { get; set; }

        [Selector("##Id ##Input")]
        public Input Id { get; set; }

        [Selector("##ScopeId ##Input")]
        public Input ScopeId { get; set; }
    }
}