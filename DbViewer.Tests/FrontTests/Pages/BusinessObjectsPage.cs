using OpenQA.Selenium.Remote;

using SkbKontur.DbViewer.Tests.FrontTests.AutoFill;
using SkbKontur.DbViewer.Tests.FrontTests.Helpers;

using SKBKontur.SeleniumTesting;
using SKBKontur.SeleniumTesting.Controls;

namespace SkbKontur.DbViewer.Tests.FrontTests.Pages
{
    [AutoFillControls]
    [PageRoute("BusinessObjects")]
    public class BusinessObjectsPage : PageBase
    {
        public BusinessObjectsPage(RemoteWebDriver webDriver)
            : base(webDriver)
        {
        }

        public Label Header { get; set; }
        public Link BackLink { get; set; }
        public Input FilterInput { get; set; }

        [LoadingComplete]
        [ChildSelector("##ObjectGroup")]
        public ControlList<BusinessObjectGroup> ObjectGroups { get; set; }

        public Link FindBusinessObjectLink(string groupName, string objectName)
        {
            var businessObjectsList = ObjectGroups.GetItemWithText(x => x.Name.Text, groupName).ObjectsList;
            return businessObjectsList.GetItemWithText(x => x.ObjectLink.Text, objectName).ObjectLink;
        }
    }
}