using System;

using Microsoft.Playwright;

using SkbKontur.DbViewer.Tests.FrontTests.AutoFill;

namespace SkbKontur.DbViewer.Tests.FrontTests.Playwright
{
    public class PwControlList<TControl> : PwControlBase
        where TControl : PwControlBase
    {
        public PwControlList(ILocator locator)
            : base(locator)
        {
        }

        public PwControlList<T> Select<T>(Func<TControl, T> selector)
            where T : PwControlBase
        {
            var dummyControl = (TControl)Activator.CreateInstance(typeof(TControl), Locator)!;
            PwAutoFill.InitializeControls(dummyControl, Locator.Page, Locator);

            return new PwControlList<T>(selector(dummyControl).Locator);
        }

        public PwControlList<TControl> Where(Func<TControl, ILocator> predicate)
        {
            var dummyControl = (TControl)Activator.CreateInstance(typeof(TControl), Locator)!;
            PwAutoFill.InitializeControls(dummyControl, Locator.Page, null);

            return new PwControlList<TControl>(Locator.Filter(new LocatorFilterOptions
                {
                    Has = predicate(dummyControl)
                }));
        }

        public TControl this[int index]
        {
            get
            {
                var controlLocator = Locator.Nth(index);
                var control = (TControl)Activator.CreateInstance(typeof(TControl), controlLocator)!;
                PwAutoFill.InitializeControls(control, Locator.Page, controlLocator);
                return control;
            }
        }
    }
}