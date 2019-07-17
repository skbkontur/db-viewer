using System.Reflection;
using Cassandra;
using Kontur.DBViewer.Core.DTO;
using Kontur.DBViewer.Core.TypeAndObjectBulding;

namespace Kontur.DBViewer.Recipes.CQL.CustomPropertyConfigurations
{
    public static class LocalTimeCustomPropertyConfiguration
    {
        public static CustomPropertyConfiguration TryGetConfiguration(PropertyInfo propertyInfo)
        {
            if (!(propertyInfo.PropertyType == typeof(LocalTime)))
                return null;
            return new CustomPropertyConfiguration
            {
                ResolvedType = typeof(Time),
                StoredToApi = @object =>
                {
                    var localTime = (LocalTime) @object;
                    return localTime == null ? null : new Time
                        {
                            Hour = localTime.Hour,
                            Minute = localTime.Minute,
                            Second = localTime.Second,
                            Nanoseconds = localTime.Nanoseconds
                        };
                },
                ApiToStored = @object =>
                {
                    var time = (Time) @object;
                    return time == null ? null : new LocalTime(time.Hour, time.Minute, time.Second, time.Nanoseconds);
                }
            };
        }
    }
}