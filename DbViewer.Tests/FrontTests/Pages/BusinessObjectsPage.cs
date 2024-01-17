using System.Threading.Tasks;

using Microsoft.Playwright;

using SkbKontur.DbViewer.Tests.FrontTests.AutoFill;
using SkbKontur.DbViewer.Tests.FrontTests.Controls;
using SkbKontur.DbViewer.Tests.FrontTests.Helpers;
using SkbKontur.DbViewer.Tests.FrontTests.Playwright;

namespace SkbKontur.DbViewer.Tests.FrontTests.Pages
{
    [PageRoute("BusinessObjects")]
    public class BusinessObjectsPage : PageBase
    {
        public BusinessObjectsPage(IPage page)
            : base(page)
        {
        }

        public Label Header { get; set; }
        public Link BackLink { get; set; }
        public Input FilterInput { get; set; }

        [Selector("##ObjectGroups ##ObjectGroup")]
        public ControlList<BusinessObjectGroup> ObjectGroups { get; set; }

        public async Task<Link> FindBusinessObjectLink(string groupName, string objectName)
        {
            var businessObjectsList = (await ObjectGroups.GetItemWithText(x => x.Name, groupName)).ObjectsList;
            return (await businessObjectsList.GetItemWithText(x => x.ObjectLink, objectName)).ObjectLink;
        }
    }
}