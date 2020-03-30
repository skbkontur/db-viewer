using System;
using System.Globalization;

using Cassandra;

using SkbKontur.DbViewer.Cql.CustomPropertyConfigurations;

namespace SkbKontur.DbViewer.Cql.Utils.ObjectsParser.ParseHelpers
{
    internal static class DateTimeParseHelper
    {
        public static bool TryParse(string value, out LocalTime result)
        {
            result = default;

            if (!TryParse(value, out DateTime date))
                return false;

            result = CassandraPrimitivesExtensions.ToLocalTime(date);
            return true;
        }

        public static bool TryParse(string value, out LocalDate result)
        {
            result = default;

            if (!TryParse(value, out DateTime date))
                return false;

            result = date.ToLocalDate();
            return true;
        }

        public static bool TryParse(string value, out DateTimeOffset result)
        {
            result = DateTimeOffset.MinValue;

            if (!TryParse(value, out DateTime date))
                return false;

            result = date;
            return true;
        }

        public static bool TryParse(string value, out DateTime result)
        {
            value = value.Trim();
            result = DateTime.MinValue;

            if (DateTime.TryParse(value, provider, style, out result))
                return true;

            if (!long.TryParse(value, out var ticks))
                return false;

            result = new DateTime(ticks, DateTimeKind.Utc);
            return true;
        }

        private const DateTimeStyles style = DateTimeStyles.AdjustToUniversal | DateTimeStyles.AssumeUniversal;

        private static readonly IFormatProvider provider = new CultureInfo("RU");
    }
}