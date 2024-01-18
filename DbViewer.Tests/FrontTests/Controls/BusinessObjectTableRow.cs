using Microsoft.Playwright;

using SkbKontur.DbViewer.Tests.FrontTests.Playwright;

namespace SkbKontur.DbViewer.Tests.FrontTests.Controls
{
    public class BusinessObjectTableRow : ControlBase
    {
        public BusinessObjectTableRow(ILocator locator)
            : base(locator)
        {
        }

        public Link Details { get; set; }
        public Link Delete { get; set; }
        public Label Id { get; set; }
        public Label ScopeId { get; set; }

        public Label FindColumn(string tid)
        {
            return new Label(Locator.GetByTestId(tid));
        }
    }
}