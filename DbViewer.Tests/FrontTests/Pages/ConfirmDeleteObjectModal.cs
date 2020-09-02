using SkbKontur.DbViewer.Tests.FrontTests.AutoFill;

using SKBKontur.SeleniumTesting;
using SKBKontur.SeleniumTesting.Controls;

namespace SkbKontur.DbViewer.Tests.FrontTests.Pages
{
    [AutoFillControls]
    public class ConfirmDeleteObjectModal : ModalBase
    {
        public ConfirmDeleteObjectModal(ISearchContainer container, ISelector selector)
            : base(container, selector)
        {
        }

        public Button Delete { get; set; }
        public Button Cancel { get; set; }
    }
}