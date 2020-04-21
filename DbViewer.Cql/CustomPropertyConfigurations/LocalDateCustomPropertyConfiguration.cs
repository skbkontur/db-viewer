using System;
using System.Reflection;

using Cassandra;

using SkbKontur.DbViewer.Configuration;

namespace SkbKontur.DbViewer.Cql.CustomPropertyConfigurations
{
    public static class LocalDateCustomPropertyConfiguration
    {
        public static CustomPropertyConfiguration? TryGetConfiguration(Type propertyType)
        {
            if (propertyType != typeof(LocalDate))
                return null;

            return new CustomPropertyConfiguration
                {
                    ResolvedType = typeof(DateTime?),
                    StoredToApi = @object => ((LocalDate?)@object).ToDateTime(),
                    ApiToStored = @object => ((DateTime?)@object).ToLocalDate(),
                };
        }
    }
}