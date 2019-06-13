using Cassandra;
using Kontur.DBViewer.Core.TypeAndObjectBulding;
using Kontur.DBViewer.Recipes.CQL.DTO;

namespace Kontur.DBViewer.Recipes.CQL
{
    public static class CqlCustomPropertyConfiguration
    {
        public static CustomPropertyConfiguration LocalTime { get; } = new CustomPropertyConfiguration
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
    }
}