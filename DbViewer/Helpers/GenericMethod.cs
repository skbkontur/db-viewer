using System;
using System.Linq.Expressions;

namespace SkbKontur.DbViewer.Helpers
{
    public static class GenericMethod
    {
        public static TResult Invoke<TResult>(Expression<Func<TResult>> expression, Type holderType, Type type)
        {
            var modifier = new GenericMethodModifier();
            return modifier.Modify(expression, new[] {type}, new[] {holderType}).Compile().Invoke();
        }

        public static TResult Invoke<TResult>(Expression<Func<TResult>> expression, Type[] holderTypes, Type[] types)
        {
            var modifier = new GenericMethodModifier();
            return modifier.Modify(expression, types, holderTypes).Compile().Invoke();
        }

        private class GenericMethodModifier : ExpressionVisitor
        {
            public Expression<Func<T>> Modify<T>(Expression<Func<T>> expression, Type[] genericArgs, Type[] holderArgs)
            {
                genericArguments = genericArgs;
                holderArguments = holderArgs;
                var result = (Expression<Func<T>>)Visit(expression);
                if (!atLeastOneMethodCallModified)
                    throw new InvalidOperationException("Nothing was modified");
                return result;
            }

            protected override Expression VisitMethodCall(MethodCallExpression node)
            {
                if (node.Method.IsGenericMethod && Fits(node.Method.GetGenericArguments(), holderArguments))
                {
                    try
                    {
                        var newGenericMethod = node.Method.GetGenericMethodDefinition().MakeGenericMethod(genericArguments);
                        return Expression.Call(node.Object, newGenericMethod, node.Arguments);
                    }
                    finally
                    {
                        atLeastOneMethodCallModified = true;
                    }
                }

                return base.VisitMethodCall(node);
            }

            private static bool Fits(Type[] first, Type[] second)
            {
                if (first.Length != second.Length)
                    return false;
                for (var i = 0; i < first.Length; ++i)
                {
                    if (first[i] != second[i])
                        return false;
                }

                return true;
            }

            private bool atLeastOneMethodCallModified;
            private Type[] genericArguments;
            private Type[] holderArguments;
        }
    }
}