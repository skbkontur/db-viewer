using System.Threading.Tasks;

using Microsoft.Playwright;

using SkbKontur.DbViewer.Tests.FrontTests.AutoFill;
using SkbKontur.DbViewer.Tests.FrontTests.Helpers;
using SkbKontur.DbViewer.Tests.FrontTests.Playwright;

namespace SkbKontur.DbViewer.Tests.FrontTests.Pages
{
    [PageRoute("BusinessObjects")]
    public class PwBusinessObjectsPage : PwPageBase
    {
        public PwBusinessObjectsPage(IPage page)
            : base(page)
        {
        }

        public PwLabel Header { get; set; }
        public PwLink BackLink { get; set; }
        public PwInput FilterInput { get; set; }

        [Selector("##ObjectGroups ##ObjectGroup")]
        public PwControlList<Controls.BusinessObjectGroup> ObjectGroups { get; set; }

        public async Task<PwLink> FindBusinessObjectLink(string groupName, string objectName)
        {
            var businessObjectsList = (await ObjectGroups.GetItemWithText(x => x.Name, groupName)).ObjectsList;
            return (await businessObjectsList.GetItemWithText(x => x.ObjectLink, objectName)).ObjectLink;
        }
    }
}