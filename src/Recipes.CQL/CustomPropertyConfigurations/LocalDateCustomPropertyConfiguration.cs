using System.Reflection;
using Cassandra;
using Kontur.DBViewer.Core.DTO;
using Kontur.DBViewer.Core.TypeAndObjectBulding;

namespace Kontur.DBViewer.Recipes.CQL.CustomPropertyConfigurations
{
    public static class LocalDateCustomPropertyConfiguration
    {
        public static CustomPropertyConfiguration TryGetConfiguration(PropertyInfo propertyInfo)
        {
            if (!(propertyInfo.PropertyType == typeof(LocalDate)))
                return null;
            return new CustomPropertyConfiguration
            {
                ResolvedType = typeof(Date),
                StoredToApi = @object =>
                {
                    var localDate = (LocalDate) @object;
                    return localDate == null ? null : new Date
                        {
                            Year = localDate.Year,
                            Month = localDate.Month,
                            Day = localDate.Day,
                        };
                },
                ApiToStored = @object =>
                {
                    var date = (Date) @object;
                    return date == null ? null : new LocalDate(date.Year, date.Month, date.Day);
                }
            };
        }
    }
}