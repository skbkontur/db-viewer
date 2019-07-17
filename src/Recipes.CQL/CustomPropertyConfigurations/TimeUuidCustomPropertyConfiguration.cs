using System;
using System.Reflection;
using Cassandra;
using Kontur.DBViewer.Core.TypeAndObjectBulding;

namespace Kontur.DBViewer.Recipes.CQL.CustomPropertyConfigurations
{
    public static class TimeUuidCustomPropertyConfiguration
    {
        public static CustomPropertyConfiguration TryGetConfiguration(PropertyInfo propertyInfo)
        {
            var realType = Nullable.GetUnderlyingType(propertyInfo.PropertyType) ?? propertyInfo.PropertyType;
            if (realType != typeof(TimeUuid))
                return null;

            return new CustomPropertyConfiguration
            {
                ResolvedType = typeof(string),
                StoredToApi = @object => @object?.ToString(),
                ApiToStored = @object =>
                {
                    var value = (string) @object;
                    if (string.IsNullOrEmpty(value))
                        return (TimeUuid?) null;
                    return TimeUuid.Parse(value);
                }
            };
        }
    }
}