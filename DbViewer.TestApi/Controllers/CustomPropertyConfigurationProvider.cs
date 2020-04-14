using System.Reflection;

using SkbKontur.DbViewer.Configuration;
using SkbKontur.DbViewer.Cql.CustomPropertyConfigurations;

namespace SkbKontur.DbViewer.TestApi.Controllers
{
    public class CustomPropertyConfigurationProvider : ICustomPropertyConfigurationProvider
    {
        public CustomPropertyConfiguration TryGetConfiguration(object @object, PropertyInfo propertyInfo)
        {
            return TryGetConfiguration(propertyInfo);
        }

        public CustomPropertyConfiguration TryGetConfiguration(PropertyInfo propertyInfo)
        {
            return LocalTimeCustomPropertyConfiguration.TryGetConfiguration(propertyInfo)
                   ?? LocalDateCustomPropertyConfiguration.TryGetConfiguration(propertyInfo)
                   ?? TimeUuidCustomPropertyConfiguration.TryGetConfiguration(propertyInfo);
        }
    }
}