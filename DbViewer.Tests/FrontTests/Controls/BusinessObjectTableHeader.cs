using System.Threading.Tasks;

using Microsoft.Playwright;

using SkbKontur.DbViewer.Tests.FrontTests.Playwright;

namespace SkbKontur.DbViewer.Tests.FrontTests.Controls
{
    public class BusinessObjectTableHeader : ControlBase
    {
        public BusinessObjectTableHeader(ILocator locator)
            : base(locator)
        {
        }

        public Task SortByColumn(string tid)
        {
            return Locator.GetByTestId(tid).ClickAsync();
        }

        public Task WaitNotSortable(string tid)
        {
            return Assertions.Expect(Locator.GetByTestId(tid)).Not.ToBeVisibleAsync();
        }
    }
}