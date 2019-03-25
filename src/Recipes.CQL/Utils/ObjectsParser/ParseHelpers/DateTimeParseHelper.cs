using System;
using System.Globalization;

namespace Kontur.DBViewer.Recipes.CQL.Utils.ObjectsParser.ParseHelpers
{
    internal class DateTimeParseHelper
    {
        public static bool TryParse(string value, out DateTime result)
        {
            result = DateTime.MinValue;
            var templates = new[]
                {
                    "dd.MM.yyyy HH:mm:ss.fff",
                    "dd.MM.yyyy HH:mm:ss",
                    "dd.MM.yyyy HH:mm",
                    "yyyy-MM-dd HH:mm:ss.fff",
                    "yyyy-MM-dd HH:mm:ss",
                    "yyyy-MM-dd HH:mm",
                    "dd.MM.yyyy",
                    "yyyy-MM-dd",
                    "dd MMMM yyyy",
                    "d MMMM yyyy",
                    "yyyy.MM.dd",
                };
            foreach(var template in templates)
            {
                if(TryParse(value, template, out result))
                    return true;
            }

            long ticks;
            if(long.TryParse(value, out ticks))
            {
                result = new DateTime(ticks, DateTimeKind.Utc);
                return true;
            }

            return false;
        }

        private static bool TryParse(string value, string template, out DateTime result)
        {
            return DateTime.TryParseExact(value, template, new CultureInfo("RU"), DateTimeStyles.AdjustToUniversal | DateTimeStyles.AssumeUniversal, out result);
        }
    }
}