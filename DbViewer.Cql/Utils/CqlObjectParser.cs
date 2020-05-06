using System;

using Cassandra;

using SkbKontur.DbViewer.Cql.CustomPropertyConfigurations;
using SkbKontur.DbViewer.Helpers;

namespace SkbKontur.DbViewer.Cql.Utils
{
    internal static class CqlObjectParser
    {
        public static object? Parse(Type type, string value)
        {
            if (type == typeof(LocalDate))
                return ParseDate(value).ToLocalDate();
            if (type == typeof(LocalTime))
                return ParseDate(value).ToLocalTime();
            if (type == typeof(TimeUuid) || type == typeof(TimeUuid?))
                return TimeUuid.Parse(value);
            return ObjectParser.Parse(type, value);
        }

        private static DateTime? ParseDate(string value)
        {
            return (DateTime?)ObjectParser.Parse(typeof(DateTime?), value);
        }
    }
}