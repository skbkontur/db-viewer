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
            if ((Nullable.GetUnderlyingType(propertyInfo.PropertyType) ?? propertyInfo.PropertyType) == typeof(TimeUuid))
                return new CustomPropertyConfiguration
                {
                    ResolvedType = typeof(string),
                    StoredToApi = @object => @object?.ToString(),
                    ApiToStored = @object =>
                    {
                        var cassandraLocalTime = (string) @object;
                        if (string.IsNullOrEmpty(cassandraLocalTime))
                            return (TimeUuid?)null;
                        return TimeUuid.Parse(cassandraLocalTime);
                    }
                };

            return null;
        }

    }
}