using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using Kontur.DBViewer.Core.DTO;
using Kontur.DBViewer.Core.VNext.DataTypes;

namespace Kontur.DBViewer.SampleApi.Impl.Utils
{
    public static class CriterionHelper
    {
        public static LambdaExpression BuildCriterion(Type businessObjectType,
            Filter[] filters)
        {
            var parameter = Expression.Parameter(businessObjectType);
            var filterExpression = filters
                .Select(filter =>
                {
                    var memberExpression = CreateMemberAccessExpression(filter.Field, parameter);
                    var valueExpression = CreateValueExpression(filter.Value, memberExpression.Type);
                    if (memberExpression.Type == typeof(DateTime) || memberExpression.Type == typeof(DateTime?))
                        return DateTimeFilterExpressionBuilder.Build(memberExpression, filter.Value,
                            filter.Type);
                    var expression = CreateFilterExpression(filter.Type, memberExpression, valueExpression);
                    if (Nullable.GetUnderlyingType(memberExpression.Type)?.IsEnum == true)
                    {
                        if (filter.Type == BusinessObjectFieldFilterOperator.DoesNotEqual && !string.IsNullOrEmpty(filter.Value))
                            expression = Expression.OrElse(
                                expression,
                                CreateFilterExpression(BusinessObjectFieldFilterOperator.Equals, memberExpression,
                                    Expression.Constant(null))
                            );
                    }

                    return expression;
                })
                .Aggregate((Expression) Expression.Constant(true), Expression.AndAlso);

            return Expression.Lambda(filterExpression, parameter);
        }

        private static Expression CreateMemberAccessExpression(string path, Expression root)
        {
            return path.Split('.').Aggregate(root, Expression.Property);
        }

        private static ConstantExpression CreateValueExpression(string stringValue,
            Type targetType)
        {
            var parsedValue = ParseValue(stringValue, targetType);
            var valueExpression = Expression.Constant(parsedValue, targetType);
            return valueExpression;
        }

        private static BinaryExpression CreateFilterExpression(BusinessObjectFieldFilterOperator @operator,
            Expression leftExpression, Expression rightExpression)
        {
            return makeBinaryExpressionByOperator[@operator](leftExpression, rightExpression);
        }

        private static object ParseValue(string stringValue, Type targetType)
        {
            if(targetType.IsEnum)
                return EnumParseHelper.TryParse(targetType, stringValue, out var result) ? result : null;
            return stringValue;
        }

        private static readonly Dictionary<BusinessObjectFieldFilterOperator, Func<Expression, Expression, BinaryExpression>>
            makeBinaryExpressionByOperator =
                new Dictionary<BusinessObjectFieldFilterOperator, Func<Expression, Expression, BinaryExpression>>
                {
                    {BusinessObjectFieldFilterOperator.Equals, Expression.Equal},
                    {BusinessObjectFieldFilterOperator.LessThan, Expression.LessThan},
                    {BusinessObjectFieldFilterOperator.GreaterThan, Expression.GreaterThan},
                    {BusinessObjectFieldFilterOperator.LessThanOrEquals, Expression.LessThanOrEqual},
                    {BusinessObjectFieldFilterOperator.GreaterThanOrEquals, Expression.GreaterThanOrEqual},
                    {BusinessObjectFieldFilterOperator.DoesNotEqual, Expression.NotEqual},
                };
    }
}