using System;
using System.Globalization;

namespace SkbKontur.DbViewer.Helpers
{
    public static class ObjectParser
    {
        public static object? Parse(Type type, string? value)
        {
            if (type.IsGenericType && type.GetGenericTypeDefinition() == typeof(Nullable<>))
                return string.IsNullOrEmpty(value) ? null : Parse(type.GetGenericArguments()[0], value);

            if (type.IsEnum)
                return Enum.Parse(type, value);
            if (type == typeof(string))
                return value;
            if (type == typeof(Guid))
                return Guid.Parse(value);
            if (type == typeof(char))
                return char.Parse(value);
            if (type == typeof(int))
                return int.Parse(value);
            if (type == typeof(short))
                return short.Parse(value);
            if (type == typeof(byte))
                return byte.Parse(value);
            if (type == typeof(sbyte))
                return sbyte.Parse(value);
            if (type == typeof(long))
                return long.Parse(value);
            if (type == typeof(bool))
                return bool.Parse(value);
            if (type == typeof(float))
                return float.Parse(value, CultureInfo.InvariantCulture);
            if (type == typeof(double))
                return double.Parse(value, CultureInfo.InvariantCulture);
            if (type == typeof(decimal))
                return decimal.Parse(value, CultureInfo.InvariantCulture);
            if (type == typeof(DateTimeOffset))
            {
                var format = "yyyy'-'MM'-'dd'T'HH':'mm':'ss.FFFFFFFK";
                if (long.TryParse(value, out var ticks))
                    return new DateTimeOffset(ticks, TimeSpan.Zero);
                return DateTimeOffset.ParseExact(value, format, CultureInfo.InvariantCulture, DateTimeStyles.AssumeUniversal);
            }

            if (type == typeof(DateTime))
            {
                var format = "yyyy'-'MM'-'dd'T'HH':'mm':'ss.FFFFFFFK";
                if (long.TryParse(value, out var ticks))
                    return new DateTime(ticks, DateTimeKind.Utc);
                return DateTime.ParseExact(value, format, CultureInfo.InvariantCulture, DateTimeStyles.RoundtripKind);
            }

            throw new InvalidOperationException($"Unsupported property type: {type.FullName}");
        }
    }
}