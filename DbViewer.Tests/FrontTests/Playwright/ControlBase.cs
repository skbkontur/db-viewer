using JetBrains.Annotations;

using Microsoft.Playwright;

namespace SkbKontur.DbViewer.Tests.FrontTests.Playwright
{
    [MeansImplicitUse(ImplicitUseTargetFlags.Members | ImplicitUseTargetFlags.WithInheritors)]
    public class ControlBase
    {
        public ControlBase(ILocator locator)
        {
            Locator = locator;
        }

        public ILocator Locator { get; }
    }
}