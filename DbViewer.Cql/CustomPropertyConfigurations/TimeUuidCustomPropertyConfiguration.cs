using System;
using System.Reflection;

using Cassandra;

using SkbKontur.DbViewer.Configuration;

namespace SkbKontur.DbViewer.Cql.CustomPropertyConfigurations
{
    public static class TimeUuidCustomPropertyConfiguration
    {
        public static CustomPropertyConfiguration? TryGetConfiguration(Type propertyType)
        {
            var realType = Nullable.GetUnderlyingType(propertyType) ?? propertyType;
            if (realType != typeof(TimeUuid))
                return null;

            return new CustomPropertyConfiguration
                {
                    ResolvedType = typeof(string),
                    StoredToApi = @object => @object?.ToString(),
                    ApiToStored = @object =>
                        {
                            var value = (string?)@object;
                            if (string.IsNullOrEmpty(value))
                                return (TimeUuid?)null;
                            return TimeUuid.Parse(value);
                        }
                };
        }
    }
}