using Microsoft.Playwright;

using SkbKontur.DbViewer.Tests.FrontTests.Playwright;

namespace SkbKontur.DbViewer.Tests.FrontTests.Controls
{
    public class BusinessObjectTableRow : PwControlBase
    {
        public BusinessObjectTableRow(ILocator locator)
            : base(locator)
        {
        }

        public PwLink Details { get; set; }
        public PwLink Delete { get; set; }
        public PwLabel Id { get; set; }
        public PwLabel ScopeId { get; set; }

        public PwLabel FindColumn(string tid)
        {
            return new PwLabel(Locator.GetByTestId(tid));
        }
    }
}