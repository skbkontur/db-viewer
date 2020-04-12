using System;
using System.Globalization;
using System.Linq.Expressions;
using System.Reflection;
using System.Reflection.Emit;

using GrEmit;

using SkbKontur.DbViewer.DataTypes;

namespace SkbKontur.DbViewer.TestApi.Impl.Utils
{
    internal static class EnumParseHelper
    {
        public static bool TryParse(Type enumType, string value, out object result, bool ignoreCase = false)
        {
            result = enumParser(enumType, value, ignoreCase);
            return result != null;
        }

        private delegate object EnumParserDelegate(Type enumType, string value, bool ignoreCase);

        private static EnumParserDelegate EmitEnumParser()
        {
            var method = new DynamicMethod(Guid.NewGuid().ToString(), typeof(object), new[] {typeof(Type), typeof(string), typeof(bool)}, typeof(string), true);
            var il = new GroboIL(method);
            var enumResultType = typeof(Enum).GetNestedType("EnumResult", BindingFlags.NonPublic);
            var enumResult = il.DeclareLocal(enumResultType);
            il.Ldarg(0);
            il.Ldarg(1);
            il.Ldarg(2);
            il.Ldloca(enumResult);
            il.Call(typeof(Enum).GetMethod("TryParseEnum", BindingFlags.Static | BindingFlags.NonPublic));
            var returnNullLabel = il.DefineLabel("returnNull");
            il.Brfalse(returnNullLabel);
            il.Ldloca(enumResult);
            il.Ldfld(enumResultType.GetField("parsedEnum", BindingFlags.Instance | BindingFlags.NonPublic));
            il.Ret();
            il.MarkLabel(returnNullLabel);
            il.Ldnull();
            il.Ret();
            return (EnumParserDelegate)method.CreateDelegate(typeof(EnumParserDelegate));
        }

        private static readonly EnumParserDelegate enumParser = EmitEnumParser();
    }

    public static class DateTimeParseHelper
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
            foreach (var template in templates)
            {
                if (TryParse(value, template, out result))
                    return true;
            }

            if (long.TryParse(value, out var ticks))
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

    public class DateTimeFilterExpressionBuilder
    {
        public static Expression Build(Expression memberAccess, string stringValue, ObjectFieldFilterOperator filterType)
        {
            if (string.IsNullOrEmpty(stringValue))
            {
                if (filterType == ObjectFieldFilterOperator.Equals)
                    return Expression.Equal(memberAccess, Expression.Constant(null));
                if (filterType == ObjectFieldFilterOperator.DoesNotEqual)
                    return Expression.NotEqual(memberAccess, Expression.Constant(null));
                throw new ArgumentOutOfRangeException(nameof(filterType), filterType, null);
            }

            DateTimeParseHelper.TryParse(stringValue, out var filterValue);
            var date = Expression.Constant(filterValue, memberAccess.Type);
            var nextDate = Expression.Constant(filterValue.AddDays(1), memberAccess.Type);
            var prevDate = Expression.Constant(filterValue.AddDays(-1), memberAccess.Type);
            Expression result;
            switch (filterType)
            {
            case ObjectFieldFilterOperator.Equals:
                result = Expression.AndAlso(Expression.LessThanOrEqual(date, memberAccess), Expression.LessThan(memberAccess, nextDate));
                break;
            case ObjectFieldFilterOperator.DoesNotEqual:
                result = Expression.OrElse(Expression.LessThan(memberAccess, date), Expression.LessThanOrEqual(nextDate, memberAccess));
                break;
            case ObjectFieldFilterOperator.LessThan:
                result = Expression.LessThan(memberAccess, date);
                break;
            case ObjectFieldFilterOperator.LessThanOrEquals:
                result = Expression.LessThan(memberAccess, prevDate);
                break;
            case ObjectFieldFilterOperator.GreaterThan:
                result = Expression.GreaterThanOrEqual(memberAccess, nextDate);
                break;
            case ObjectFieldFilterOperator.GreaterThanOrEquals:
                result = Expression.GreaterThanOrEqual(memberAccess, date);
                break;
            default:
                throw new ArgumentOutOfRangeException(nameof(filterType), filterType, null);
            }

            if (memberAccess.Type == typeof(DateTime?) && filterType == ObjectFieldFilterOperator.DoesNotEqual)
                result = Expression.OrElse(result, Expression.Equal(memberAccess, Expression.Constant(null)));
            return result;
        }
    }
}