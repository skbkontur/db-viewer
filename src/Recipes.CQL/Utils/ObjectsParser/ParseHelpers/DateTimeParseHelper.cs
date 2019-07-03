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

        public static bool TryParse(string value, out DateTime result)
        {
            return TryParse(value, DateTemplates.Concat(DateTimeTemplates).ToArray(), out result);
        }

        private static bool TryParse(string value, string[] templates, out DateTime result)
        {
            result = DateTime.MinValue;

            foreach (var template in templates)
            {
                if (TryParse(value, template, out result))
                    return true;
            }

            if (!long.TryParse(value, out var ticks))
                return false;

            result = new DateTime(ticks, DateTimeKind.Utc);
            return true;
        }

        private static bool TryParse(string value, string template, out DateTime result)
        {
            return DateTime.TryParseExact(value, template, new CultureInfo("RU"),
                DateTimeStyles.AdjustToUniversal | DateTimeStyles.AssumeUniversal, out result);
        }

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
    }
}