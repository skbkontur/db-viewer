using JetBrains.Annotations;

using Microsoft.Playwright;

namespace SkbKontur.DbViewer.Tests.FrontTests.Playwright
{
    [MeansImplicitUse(ImplicitUseTargetFlags.Members | ImplicitUseTargetFlags.WithInheritors)]
    public class PageBase
    {
        public PageBase(IPage page)
        {
            Page = page;
        }

        public IPage Page { get; }
    }
}