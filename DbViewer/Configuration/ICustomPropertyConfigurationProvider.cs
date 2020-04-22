using System;
using System.Reflection;

namespace SkbKontur.DbViewer.Configuration
{
    public interface ICustomPropertyConfigurationProvider
    {
        CustomPropertyConfiguration? TryGetConfiguration(object @object, PropertyInfo propertyInfo);
        CustomPropertyConfiguration? TryGetConfiguration(PropertyInfo propertyInfo);
        CustomPropertyConfiguration? TryGetConfiguration(Type propertyType);
    }
}