using System;
using System.Reflection;

using SkbKontur.DbViewer.Configuration;
using SkbKontur.DbViewer.Cql.CustomPropertyConfigurations;

namespace SkbKontur.DbViewer.TestApi.Controllers
{
    public class CustomPropertyConfigurationProvider : ICustomPropertyConfigurationProvider
    {
        public CustomPropertyConfiguration? TryGetConfiguration(object @object, PropertyInfo propertyInfo)
        {
            return TryGetConfiguration(propertyInfo);
        }

        public CustomPropertyConfiguration? TryGetConfiguration(PropertyInfo propertyInfo)
        {
            return TryGetConfiguration(propertyInfo.PropertyType);
        }

        public CustomPropertyConfiguration? TryGetConfiguration(Type propertyType)
        {
            return LocalTimeCustomPropertyConfiguration.TryGetConfiguration(propertyType)
                   ?? LocalDateCustomPropertyConfiguration.TryGetConfiguration(propertyType)
                   ?? TimeUuidCustomPropertyConfiguration.TryGetConfiguration(propertyType);
        }
    }
}