using System.Reflection;
using Cassandra;
using Kontur.DBViewer.Core.TypeAndObjectBulding;
using Kontur.DBViewer.Recipes.CQL.DTO;

namespace Kontur.DBViewer.Recipes.CQL.CustomPropertyConfigurations
{
    public static class LocalTimeCustomPropertyConfiguration
    {
        public static CustomPropertyConfiguration TryGetConfiguration(PropertyInfo propertyInfo)
        {
            if (propertyInfo.PropertyType == typeof(LocalTime))
                return new CustomPropertyConfiguration
                {
                    ResolvedType = typeof(CassandraLocalTime),
                    StoredToApi = @object =>
                    {
                        var localTime = (LocalTime) @object;
                        return localTime != null
                            ? new CassandraLocalTime
                            {
                                Hour = localTime.Hour,
                                Nanoseconds = localTime.Nanoseconds,
                                Minute = localTime.Minute,
                                Second = localTime.Second,
                            }
                            : null;
                    },
                    ApiToStored = @object =>
                    {
                        var cassandraLocalTime = (CassandraLocalTime) @object;
                        return cassandraLocalTime != null
                            ? new LocalTime(
                                cassandraLocalTime.Hour,
                                cassandraLocalTime.Minute,
                                cassandraLocalTime.Second,
                                cassandraLocalTime.Nanoseconds)
                            : null;
                    }
                };

            return null;
        }
    }
}