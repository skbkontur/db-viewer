using System;
using System.Linq;
using System.Reflection;

using JetBrains.Annotations;

using SKBKontur.SeleniumTesting;
using SKBKontur.SeleniumTesting.Controls;

namespace SkbKontur.DbViewer.Tests.FrontTests.AutoFill
{
    [MeansImplicitUse(ImplicitUseTargetFlags.Members)]
    public class AutoFillControlsAttribute : Attribute, IPageActionAttribute, ICompoundControlActionAttribute
    {
        public void OnInit(PageBase pageInstance)
        {
            InitializeControlBases(pageInstance);
        }

        public void OnInit(CompoundControl control)
        {
            InitializeControlBases(control);
        }

        private static void InitializeControlBases(object instance)
        {
            var type = instance.GetType();
            foreach (var propertyInfo in type.GetProperties())
            {
                if (propertyInfo.GetCustomAttributes<SkipAutoFillAttribute>().Any())
                    continue;
                if (typeof(ControlBase).IsAssignableFrom(propertyInfo.PropertyType))
                {
                    var selector =
                        propertyInfo.GetCustomAttributes<SelectorAttribute>().Select(x => x.Selector).FirstOrDefault()
                        ?? new UniversalSelector("##" + propertyInfo.Name);
                    if (propertyInfo.PropertyType.IsGenericType && typeof(ControlList<>) == propertyInfo.PropertyType.GetGenericTypeDefinition())
                    {
                        var childSelector = propertyInfo.GetCustomAttributes<ChildSelectorAttribute>().Select(x => x.Selector).FirstOrDefault();
                        if (childSelector == null)
                        {
                            throw new InvalidOperationException(
                                string.Format(
                                    "Автозаполняемое свойство {0} в типе {1} является списком и не содержит атрибута ChildSelector",
                                    propertyInfo.Name,
                                    instance.GetType().Name));
                        }
                        propertyInfo.SetValue(
                            instance,
                            Activator.CreateInstance(propertyInfo.PropertyType, instance, selector, childSelector));
                    }
                    else
                    {
                        propertyInfo.SetValue(
                            instance,
                            Activator.CreateInstance(propertyInfo.PropertyType, instance, selector));
                    }
                }
            }
        }
    }
}