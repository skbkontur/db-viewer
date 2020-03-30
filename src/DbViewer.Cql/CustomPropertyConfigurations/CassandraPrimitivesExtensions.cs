using System;

using Cassandra;

namespace SkbKontur.DbViewer.Cql.CustomPropertyConfigurations
{
    public static class CassandraPrimitivesExtensions
    {
        public static LocalDate ToLocalDate(this DateTime dateTime)
        {
            return new LocalDate(dateTime.Year, dateTime.Month, dateTime.Day);
        }

        public static LocalTime ToLocalTime(this DateTime dateTime)
        {
            return new LocalTime(dateTime.Hour, dateTime.Minute, dateTime.Second, dateTime.Millisecond * nanosecondsInMilliseconds);
        }

        public static LocalDate ToLocalDate(this DateTime? dateTime)
        {
            return dateTime == null ? null : ToLocalDate(dateTime.Value);
        }

        public static LocalTime ToLocalTime(this DateTime? dateTime)
        {
            return dateTime == null ? null : ToLocalTime(dateTime.Value);
        }

        public static DateTime? ToDateTime(this LocalDate localDate)
        {
            return localDate == null ? (DateTime?)null : new DateTime(localDate.Year, localDate.Month, localDate.Day, 0, 0, 0, DateTimeKind.Utc);
        }

        public static DateTime? ToDateTime(this LocalTime localTime)
        {
            return localTime == null ? (DateTime?)null : new DateTime(1, 1, 1, localTime.Hour, localTime.Minute, localTime.Second, localTime.Nanoseconds / nanosecondsInMilliseconds);
        }

        private const int nanosecondsInMilliseconds = 1000000;
    }
}