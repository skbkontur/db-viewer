using System;
using System.Linq.Expressions;

namespace Kontur.DBViewer.Core.GenericHelpers
{
    public static class GenericMethod
    {
        public static T Invoke<T>(Expression<Func<T>> expression, Type type)
        {
            return Invoke(expression, typeof(ArgumentHolder), type);
        }

        public static void Invoke(Expression<Action> expression, Type type)
        {
            Invoke(expression, typeof(ArgumentHolder), type);
        }

        public static T Invoke<T>(Expression<Func<T>> expression, Type[] type)
        {
            var array = new Type[type.Length];
            for(int i = 0; i < array.Length; i++)
            {
                array[i] = typeof(ArgumentHolder);
            }
            return Invoke(expression, array, type);
        }

        public static void Invoke(Expression<Action> expression, Type[] type)
        {
            var array = new Type[type.Length];
            for (int i = 0; i < array.Length; i++)
            {
                array[0] = typeof(ArgumentHolder);
            }
            Invoke(expression, array, type);
        }

        public static TResult Invoke<TResult>(Expression<Func<TResult>> expression, Type holderType, Type type)
        {
            var modifier = new GenericMethodModifier();
            return modifier.Modify(expression, new[] {type}, new[] {holderType}).Compile().Invoke();
        }

        public static void Invoke(Expression<Action> expression, Type holderType, Type type)
        {
            var modifier = new GenericMethodModifier();
            modifier.Modify(expression, new[] {type}, new[] {holderType}).Compile().Invoke();
        }

        public static TResult Invoke<TResult>(Expression<Func<TResult>> expression, Type[] holderTypes, Type[] types)
        {
            var modifier = new GenericMethodModifier();
            return modifier.Modify(expression, types, holderTypes).Compile().Invoke();
        }

        public static void Invoke(Expression<Action> expression, Type[] holderTypes, Type[] types)
        {
            var modifier = new GenericMethodModifier();
            modifier.Modify(expression, types, holderTypes).Compile().Invoke();
        }

        public class GenericMethodModifier : ExpressionVisitor
        {
            public Expression<Func<T>> Modify<T>(Expression<Func<T>> expression, Type[] genericArgs, Type[] holderArgs)
            {
                genericArguments = genericArgs;
                holderArguments = holderArgs;
                var result = Visit(expression) as Expression<Func<T>>;
                if(!atLeastOneMethodCallModified)
                    throw new GenericMethodInvocationException();
                return result;
            }

            public Expression<Action> Modify(Expression<Action> expression, Type[] genericArgs, Type[] holderArgs)
            {
                genericArguments = genericArgs;
                holderArguments = holderArgs;
                var result = Visit(expression) as Expression<Action>;
                if(!atLeastOneMethodCallModified)
                    throw new GenericMethodInvocationException();
                return result;
            }

            protected override Expression VisitMethodCall(MethodCallExpression node)
            {
                if(node.Method.IsGenericMethod && Fits(node.Method.GetGenericArguments(), holderArguments))
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

            private bool Fits(Type[] first, Type[] second)
            {
                if(first.Length != second.Length)
                    return false;
                for(var i = 0; i < first.Length; ++i)
                {
                    if(first[i] != second[i])
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