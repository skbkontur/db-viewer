using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

using SkbKontur.DbViewer.Dto;
using SkbKontur.DbViewer.VNext.DataTypes;

namespace SkbKontur.DbViewer.TestApi.Impl.Utils
{
    public static class CriterionHelper
    {
        public static LambdaExpression BuildCriterion(Type businessObjectType, Filter[] filters)
        {
            var parameter = Expression.Parameter(businessObjectType);
            var filterExpression = filters
                                   .Select(filter =>
                                       {
                                           var memberExpression = CreateMemberAccessExpression(filter.Field, parameter);
                                           var valueExpression = CreateValueExpression(filter.Value, memberExpression.Type);
                                           if (memberExpression.Type == typeof(DateTime) || memberExpression.Type == typeof(DateTime?))
                                               return DateTimeFilterExpressionBuilder.Build(memberExpression, filter.Value, filter.Type);

                                           var expression = CreateFilterExpression(filter.Type, memberExpression, valueExpression);
                                           if (Nullable.GetUnderlyingType(memberExpression.Type)?.IsEnum == true)
                                           {
                                               if (filter.Type == ObjectFieldFilterOperator.DoesNotEqual && !string.IsNullOrEmpty(filter.Value))
                                                   expression = Expression.OrElse(expression,
                                                                                  CreateFilterExpression(ObjectFieldFilterOperator.Equals, memberExpression,
                                                                                                         Expression.Constant(null)));
                                           }

                                           return expression;
                                       })
                                   .Aggregate((Expression)Expression.Constant(true), Expression.AndAlso);

            return Expression.Lambda(filterExpression, parameter);
        }

        private static Expression CreateMemberAccessExpression(string path, Expression root)
        {
            return path.Split('.').Aggregate(root, Expression.Property);
        }

        private static ConstantExpression CreateValueExpression(string stringValue, Type targetType)
        {
            var parsedValue = ParseValue(stringValue, targetType);
            var valueExpression = Expression.Constant(parsedValue, targetType);
            return valueExpression;
        }

        private static BinaryExpression CreateFilterExpression(ObjectFieldFilterOperator @operator, Expression leftExpression, Expression rightExpression)
        {
            return makeBinaryExpressionByOperator[@operator](leftExpression, rightExpression);
        }

        private static object ParseValue(string stringValue, Type targetType)
        {
            if (targetType.IsEnum)
                return EnumParseHelper.TryParse(targetType, stringValue, out var result) ? result : null;
            return stringValue;
        }

        private static readonly Dictionary<ObjectFieldFilterOperator, Func<Expression, Expression, BinaryExpression>> makeBinaryExpressionByOperator =
            new Dictionary<ObjectFieldFilterOperator, Func<Expression, Expression, BinaryExpression>>
                {
                    {ObjectFieldFilterOperator.Equals, Expression.Equal},
                    {ObjectFieldFilterOperator.LessThan, Expression.LessThan},
                    {ObjectFieldFilterOperator.GreaterThan, Expression.GreaterThan},
                    {ObjectFieldFilterOperator.LessThanOrEquals, Expression.LessThanOrEqual},
                    {ObjectFieldFilterOperator.GreaterThanOrEquals, Expression.GreaterThanOrEqual},
                    {ObjectFieldFilterOperator.DoesNotEqual, Expression.NotEqual},
                };
    }
}