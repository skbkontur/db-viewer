using System.Reflection;
using Kontur.DBViewer.Core.TypeAndObjectBulding;
using Kontur.DBViewer.Recipes.CQL.CustomPropertyConfigurations;

namespace Kontur.DBViewer.SampleApi.Controllers
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