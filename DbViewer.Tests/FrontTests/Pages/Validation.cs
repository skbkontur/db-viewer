using SkbKontur.DbViewer.Tests.FrontTests.Helpers;

using SKBKontur.SeleniumTesting;
using SKBKontur.SeleniumTesting.Controls;

namespace SkbKontur.DbViewer.Tests.FrontTests.Pages
{
    public class Validation : ControlBase
    {
        public Validation(ISearchContainer container, ISelector selector)
            : base(container, selector)
        {
            portal = container.Find<Portal>().By(selector + "[data-comp-name*='Portal']:portal div[class*='react-ui']");
        }

        public void ExpectIsOpenedWithMessage(string message = null)
        {
            if (message != null)
            {
                portal.WaitText(message);
            }
        }

        private readonly Portal portal;
    }
}