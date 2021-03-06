﻿using System;
using System.Reflection;

using Newtonsoft.Json.Linq;

namespace SkbKontur.DbViewer.TestApi.Impl.Attributes
{
    public class SerializedAttribute : Attribute
    {
        public SerializedAttribute(Type type)
        {
            Type = type;
        }

        public Type Type { get; }
    }

    public interface ITypeResolver
    {
        Type ResolveType(object @object, PropertyInfo property);
    }

    public abstract class TypeResolverBase<T> : ITypeResolver
    {
        public Type ResolveType(object @object, PropertyInfo propertyInfo)
        {
            switch (@object)
            {
            case T t:
                return ResolveObject(t, propertyInfo);
            case JObject jObject:
                return ResolveJson(jObject, propertyInfo);
            default:
                throw new NotSupportedException();
            }
        }

        protected abstract Type ResolveObject(T @object, PropertyInfo propertyInfo);
        protected abstract Type ResolveJson(JObject @object, PropertyInfo propertyInfo);
    }
}