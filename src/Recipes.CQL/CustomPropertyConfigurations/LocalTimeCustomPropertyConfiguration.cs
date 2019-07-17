using System;
using System.Reflection;
using Cassandra;
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
                ResolvedType = typeof(DateTime?),
                StoredToApi = @object => ((LocalTime) @object).ToDateTime(),
                ApiToStored = @object => ((DateTime?) @object).ToLocalTime(),
            };
        }
    }
}