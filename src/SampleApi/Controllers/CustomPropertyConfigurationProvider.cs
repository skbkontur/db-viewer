using System.Reflection;
using Cassandra;
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
    
    public static class LocalDateCustomPropertyConfiguration
    {
        public static CustomPropertyConfiguration TryGetConfiguration(PropertyInfo propertyInfo)
        {
            if (!(propertyInfo.PropertyType == typeof(LocalDate)))
                return null;
            return new CustomPropertyConfiguration
            {
                ResolvedType = typeof(string),
                StoredToApi = @object =>
                {
                    var localDate = (LocalDate)@object;
                    return localDate.ToString();
                },
                ApiToStored = @object =>
                {
                    var dateTime = (string)@object;
                    return LocalDate.Parse(dateTime);
                }
            };
        }
    }
}