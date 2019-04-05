using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using Newtonsoft.Json.Linq;

namespace Kontur.DBViewer.Core.TypeInformation
{
    public static class ValueBuilder
    {
        public static object BuildValue(TypeInfo typeInfo, Type type, object o,
            ICustomPropertyConfigurationProvider customPropertyConfigurationProvider)
        {
            var jObject = (JToken) o;
            var xxx = jObject.ToString();
            if (jObject.ToString() == "")
                return null;
            if (!(typeInfo is ClassTypeInfo classTypeInfo))
                return jObject.ToObject(type);

            var result = Activator.CreateInstance(type);
            foreach (var property in classTypeInfo.Properties)
            {
                var propertyInfo = type.GetProperty(property.Description.Name);
                var customPropertyConfiguration =
                    customPropertyConfigurationProvider?.TryGetConfiguration(propertyInfo);
                object value;
                if (customPropertyConfiguration != null)
                {
                    value =
                        customPropertyConfiguration.BuildValue(BuildValue(
                            property.TypeInfo,
                            customPropertyConfiguration.ResolvedType,
                            jObject.SelectToken(property.Description.Name),
                            customPropertyConfigurationProvider
                        ));
                }
                else
                {
                    value =
                        BuildValue(
                            property.TypeInfo,
                            propertyInfo.PropertyType,
                            jObject.SelectToken(property.Description.Name),
                            customPropertyConfigurationProvider
                        );
                }

                propertyInfo.SetValue(result, value);
            }

            return result;
        }
    }

    public static class ValueExtractor
    {
        public static object ExtractValue(TypeInfo typeInfo, Type type, object o,
            ICustomPropertyConfigurationProvider customPropertyConfigurationProvider)
        {
            if (o == null)
                return null;
            if (!(typeInfo is ClassTypeInfo classTypeInfo))
                return o;

            var result = new Dictionary<string, object>();
            foreach (var property in classTypeInfo.Properties)
            {
                var propertyInfo = type.GetProperty(property.Description.Name);
                var propertyValue = propertyInfo.GetValue(o);
                var customPropertyConfiguration =
                    customPropertyConfigurationProvider?.TryGetConfiguration(propertyInfo);
                if (customPropertyConfiguration != null)
                {
                    result[property.Description.Name] =
                        ExtractValue(
                            property.TypeInfo,
                            customPropertyConfiguration.ResolvedType,
                            customPropertyConfiguration.ExtractValue(propertyValue),
                            customPropertyConfigurationProvider
                        );
                }
                else
                {
                    result[property.Description.Name] =
                        ExtractValue(
                            property.TypeInfo,
                            propertyInfo.PropertyType,
                            propertyValue,
                            customPropertyConfigurationProvider
                        );
                }
            }

            return result;
        }
    }

    public static class TypeInfoExtractor
    {
        private static readonly ConcurrentDictionary<Type, TypeInfo> typeInfos =
            new ConcurrentDictionary<Type, TypeInfo>();

        public static TypeInfo Extract(Type type, IPropertyDescriptionBuilder propertyDescriptionBuilder,
            ICustomPropertyConfigurationProvider customPropertyConfigurationProvider)
        {
            return typeInfos.GetOrAdd(type,
                t => ResolveType(t, propertyDescriptionBuilder, customPropertyConfigurationProvider));
        }

        private static TypeInfo ResolveType(Type type, IPropertyDescriptionBuilder propertyDescriptionBuilder,
            ICustomPropertyConfigurationProvider customPropertyConfigurationProvider)
        {
            var realType = Nullable.GetUnderlyingType(type) ?? type;
            var canBeNull = Nullable.GetUnderlyingType(type) != null;
            if (realType == typeof(string) || realType == typeof(Guid))
                return new StringTypeInfo();
            if (realType == typeof(byte))
                return new ByteTypeInfo(canBeNull);
            if (realType == typeof(char))
                return new CharTypeInfo(canBeNull);
            if (realType == typeof(int))
                return new IntTypeInfo(canBeNull);
            if (realType == typeof(DateTime) || realType == typeof(DateTimeOffset))
                return new DateTimeTypeInfo(canBeNull);
            if (realType == typeof(long))
                return new LongTypeInfo(canBeNull);
            if (realType == typeof(bool))
                return new BoolTypeInfo(canBeNull);
            if (realType == typeof(decimal))
                return new DecimalTypeInfo(canBeNull);
            if (realType.IsEnum)
                return new EnumTypeInfo(canBeNull, Enum.GetNames(realType));
            if (realType.IsArray)
                return new EnumerableTypeInfo(ResolveType(realType.GetElementType(), propertyDescriptionBuilder,
                    customPropertyConfigurationProvider));
            if (realType.IsGenericType && realType.GetGenericTypeDefinition() == typeof(List<>))
                return new EnumerableTypeInfo(ResolveType(realType.GetGenericArguments()[0], propertyDescriptionBuilder,
                    customPropertyConfigurationProvider));
            if (realType.IsGenericType && realType.GetGenericTypeDefinition() == typeof(Dictionary<,>))
                return new DictionaryTypeInfo(
                    ResolveType(realType.GetGenericArguments()[0], propertyDescriptionBuilder,
                        customPropertyConfigurationProvider),
                    ResolveType(realType.GetGenericArguments()[1], propertyDescriptionBuilder,
                        customPropertyConfigurationProvider));
            if (realType.IsGenericType && realType.GetGenericTypeDefinition() == typeof(HashSet<>))
                return new HashSetTypeInfo(ResolveType(realType.GetGenericArguments()[0], propertyDescriptionBuilder,
                    customPropertyConfigurationProvider));
            if (realType.IsClass)
                return new ClassTypeInfo
                {
                    Properties = realType.GetProperties().Select(p =>
                        ResolveProperty(p, propertyDescriptionBuilder, customPropertyConfigurationProvider)).ToArray(),
                };

            throw new NotSupportedException($"{type.FullName} не поддерживается");
        }

        private static Property ResolveProperty(PropertyInfo propertyInfo,
            IPropertyDescriptionBuilder propertyDescriptionBuilder,
            ICustomPropertyConfigurationProvider customPropertyConfigurationProvider)
        {
            var typeInfo = ResolveType(
                customPropertyConfigurationProvider?.TryGetConfiguration(propertyInfo)?.ResolvedType
                ??
                propertyInfo.PropertyType,
                propertyDescriptionBuilder, customPropertyConfigurationProvider
            );
            return new Property
            {
                TypeInfo = typeInfo,
                Description = propertyDescriptionBuilder.Build(propertyInfo, typeInfo),
            };
        }
    }
}