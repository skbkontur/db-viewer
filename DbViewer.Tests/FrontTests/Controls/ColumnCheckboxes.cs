using Microsoft.Playwright;

using SkbKontur.DbViewer.Tests.FrontTests.Playwright;

namespace SkbKontur.DbViewer.Tests.FrontTests.Controls
{
    public class ColumnCheckboxes : PwControlBase
    {
        public ColumnCheckboxes(ILocator locator)
            : base(locator)
        {
        }

        public PwCheckbox GetCheckbox(string tid)
        {
            return new PwCheckbox(Locator.GetByTestId(tid));
        }
    }
}