using System;

using Microsoft.Playwright;

using SkbKontur.DbViewer.Tests.FrontTests.AutoFill;

namespace SkbKontur.DbViewer.Tests.FrontTests.Playwright
{
    public class ControlList<TControl> : ControlBase
        where TControl : ControlBase
    {
        public ControlList(ILocator locator)
            : base(locator)
        {
        }

        public ControlList<T> Select<T>(Func<TControl, T> selector)
            where T : ControlBase
        {
            var dummyControl = (TControl)Activator.CreateInstance(typeof(TControl), Locator)!;
            AutoFillControls.InitializeControls(dummyControl, Locator.Page, Locator);

            return new ControlList<T>(selector(dummyControl).Locator);
        }

        public ControlList<TControl> Where(Func<TControl, ILocator> predicate)
        {
            var dummyControl = (TControl)Activator.CreateInstance(typeof(TControl), Locator)!;
            AutoFillControls.InitializeControls(dummyControl, Locator.Page, null);

            return new ControlList<TControl>(Locator.Filter(new LocatorFilterOptions
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
                AutoFillControls.InitializeControls(control, Locator.Page, controlLocator);
                return control;
            }
        }
    }
}