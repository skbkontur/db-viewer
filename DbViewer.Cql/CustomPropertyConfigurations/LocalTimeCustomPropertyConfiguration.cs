using System;

using Cassandra;

using SkbKontur.DbViewer.Configuration;

namespace SkbKontur.DbViewer.Cql.CustomPropertyConfigurations
{
    public static class LocalTimeCustomPropertyConfiguration
    {
        public static CustomPropertyConfiguration? TryGetConfiguration(Type propertyType)
        {
            if (propertyType != typeof(LocalTime))
                return null;

            return new CustomPropertyConfiguration
                {
                    ResolvedType = typeof(DateTime?),
                    StoredToApi = @object => ((LocalTime?)@object).ToDateTime(),
                    ApiToStored = @object => ((DateTime?)@object).ToLocalTime(),
                };
        }
    }
}