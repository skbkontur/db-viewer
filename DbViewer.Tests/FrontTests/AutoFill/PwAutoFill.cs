using System;
using System.Linq;
using System.Reflection;

using Microsoft.Playwright;

using SkbKontur.DbViewer.Tests.FrontTests.Playwright;

namespace SkbKontur.DbViewer.Tests.FrontTests.AutoFill
{
    public class PwAutoFill
    {
        public static TPage InitializePage<TPage>(IPage page)
            where TPage : PwPageBase
        {
            var newPage = (TPage)Activator.CreateInstance(typeof(TPage), page)!;
            InitializeControls(newPage, newPage.Page, null);
            return newPage;
        }

        public static void InitializeControls(object instance, IPage page, ILocator? parent)
        {
            var properties = instance
                             .GetType()
                             .GetProperties(BindingFlags.Instance | BindingFlags.Public)
                             .Where(p => p.CanWrite && typeof(PwControlBase).IsAssignableFrom(p.PropertyType) && !p.GetCustomAttributes<SkipAutoFillAttribute>().Any());

            foreach (var property in properties)
            {
                var locator = LocatorForProperty(property, page, parent);
                var value = Activator.CreateInstance(property.PropertyType, locator)!;
                InitializeControls(value, page, locator);
                property.SetValue(instance, value);
            }
        }

        public static ILocator LocatorForProperty(PropertyInfo property, IPage page, ILocator? parent)
        {
            var selector = property
                           .GetCustomAttributes<SelectorAttribute>()
                           .Select(x => x.Selector.ToString())
                           .FirstOrDefault();

            if (string.IsNullOrEmpty(selector))
                return GetByTestId(page, parent, property.Name);

            var selectors = selector.Split(" ", StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries);
            return selectors
                .Aggregate(
                    parent,
                    (current, s) => s.StartsWith("##")
                                        ? GetByTestId(page, current, s[2..])
                                        : GetLocator(page, current, s)
                )!;
        }

        private static ILocator GetByTestId(IPage page, ILocator? parent, string tid) => parent == null ? page.GetByTestId(tid) : parent.GetByTestId(tid);
        private static ILocator GetLocator(IPage page, ILocator? parent, string loc) => parent == null ? page.Locator(loc) : parent.Locator(loc);
    }
}