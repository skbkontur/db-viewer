using System.Threading.Tasks;

using Microsoft.Playwright;

using SkbKontur.DbViewer.Tests.FrontTests.AutoFill;
using SkbKontur.DbViewer.Tests.FrontTests.Playwright;

namespace SkbKontur.DbViewer.Tests.FrontTests.Controls
{
    public class FilterModal : PwControlBase
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
        public PwControlList<BusinessObjectFilter> ObjectFilters { get; set; }

        public PwButton Apply { get; set; }
        public PwLink Clear { get; set; }

        [Selector("##Id ##Input")]
        public PwInput Id { get; set; }

        [Selector("##ScopeId ##Input")]

        public PwInput ScopeId { get; set; }
    }
}