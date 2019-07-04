using System;
using System.Globalization;
using System.Linq;
using Cassandra;

namespace Kontur.DBViewer.Recipes.CQL.Utils.ObjectsParser.ParseHelpers
{
    internal static class DateTimeParseHelper
    {
        public static bool TryParse(string value, out LocalDate result)
        {
            result = default(LocalDate);

            if (!TryParse(value, DateTemplates, out var date))
                return false;

            result = new LocalDate(date.Year, date.Month, date.Day);
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
            return TryParse(value, DateTemplates.Concat(DateTimeTemplates).ToArray(), out result);
        }

        private static bool TryParse(string value, string[] templates, out DateTime result)
        {
            result = DateTime.MinValue;

            if (DateTime.TryParseExact(value, templates, Provider, Style, out result))
                return true;

            if (!long.TryParse(value, out var ticks))
                return false;

            result = new DateTime(ticks, DateTimeKind.Utc);
            return true;
        }

        private const DateTimeStyles Style = DateTimeStyles.AdjustToUniversal | DateTimeStyles.AssumeUniversal;

        private static readonly string[] DateTemplates =
        {
            "dd.MM.yyyy",
            "yyyy-MM-dd",
            "dd MMMM yyyy",
            "d MMMM yyyy",
            "yyyy.MM.dd",
        };

        private static readonly string[] DateTimeTemplates =
        {
            "dd.MM.yyyy HH:mm:ss.fff",
            "dd.MM.yyyy HH:mm:ss",
            "dd.MM.yyyy HH:mm",
            "yyyy-MM-dd HH:mm:ss.fff",
            "yyyy-MM-dd HH:mm:ss",
            "yyyy-MM-dd HH:mm",
        };

        private static readonly IFormatProvider Provider = new CultureInfo("RU");
    }
}