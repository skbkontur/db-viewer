﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

using SkbKontur.DbViewer.DataTypes;

namespace SkbKontur.DbViewer.Helpers
{
    public static class CriterionHelper
    {
        public static Expression<Func<T, TProperty>> BuildSort<T, TProperty>(Sort sort)
        {
            return (Expression<Func<T, TProperty>>)BuildSortExpression(typeof(T), sort.Path);
        }

        public static Expression<Func<T, bool>> BuildPredicate<T>(Condition[] filters, Func<Type, string, object?> parse = null)
        {
            return (Expression<Func<T, bool>>)BuildPredicate(typeof(T), filters, parse ?? ObjectParser.Parse);
        }

        private static LambdaExpression BuildSortExpression(Type type, string propertyPath)
        {
            var parameterExpression = Expression.Parameter(type);
            var memberExpression = CreateMemberAccessExpression(propertyPath, parameterExpression);
            return Expression.Lambda(memberExpression, parameterExpression);
        }

        private static LambdaExpression BuildPredicate(Type type, Condition[] filters, Func<Type, string, object?> parse)
        {
            var parameter = Expression.Parameter(type);

            if (!filters.Any())
                return Expression.Lambda(Expression.Constant(true), parameter);

            var filterExpression = filters
                                   .Select(filter =>
                                       {
                                           var memberExpression = CreateMemberAccessExpression(filter.Path, parameter);
                                           var valueExpression = CreateValueExpression(filter.Value, memberExpression.Type, parse);
                                           var expression = CreateFilterExpression(memberExpression.Type, filter.Operator, memberExpression, valueExpression);
                                           if (Nullable.GetUnderlyingType(memberExpression.Type)?.IsEnum == true)
                                           {
                                               if (filter.Operator == ObjectFieldFilterOperator.DoesNotEqual && !string.IsNullOrEmpty(filter.Value))
                                                   expression = Expression.OrElse(expression,
                                                                                  CreateFilterExpression(memberExpression.Type, ObjectFieldFilterOperator.Equals, memberExpression,
                                                                                                         Expression.Constant(null)));
                                           }

                                           return expression;
                                       }).ToArray();

            return Expression.Lambda(filterExpression.Skip(1).Aggregate(filterExpression[0], Expression.AndAlso), parameter);
        }

        private static Expression CreateMemberAccessExpression(string path, Expression root)
        {
            return path.Split('.').Aggregate(root, Expression.Property);
        }

        private static ConstantExpression CreateValueExpression(string stringValue, Type targetType, Func<Type, string, object?> parse)
        {
            var parsedValue = parse(targetType, stringValue);
            var valueExpression = Expression.Constant(parsedValue, targetType);
            return valueExpression;
        }

        private static BinaryExpression CreateFilterExpression(Type propertyType, ObjectFieldFilterOperator @operator, Expression leftExpression, Expression rightExpression)
        {
            if (propertyType == typeof(string))
            {
                var compareToInvocation = Expression.Call(leftExpression, typeof(string).GetMethod("CompareTo", new[] {typeof(string)}), rightExpression);
                return makeBinaryExpressionByOperator[@operator](compareToInvocation, Expression.Constant(0, typeof(int)));
            }

            return makeBinaryExpressionByOperator[@operator](leftExpression, rightExpression);
        }

        private static readonly Dictionary<ObjectFieldFilterOperator, Func<Expression, Expression, BinaryExpression>>
            makeBinaryExpressionByOperator =
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