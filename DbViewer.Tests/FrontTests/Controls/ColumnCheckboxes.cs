using Microsoft.Playwright;

using SkbKontur.DbViewer.Tests.FrontTests.Playwright;

namespace SkbKontur.DbViewer.Tests.FrontTests.Controls
{
    public class ColumnCheckboxes : ControlBase
    {
        public ColumnCheckboxes(ILocator locator)
            : base(locator)
        {
        }

        public Checkbox GetCheckbox(string tid)
        {
            return new Checkbox(Locator.GetByTestId(tid));
        }
    }
}