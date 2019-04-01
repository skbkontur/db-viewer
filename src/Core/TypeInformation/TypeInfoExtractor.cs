using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace Kontur.DBViewer.Core.TypeInformation
{
    public class ValueExtractor
    {
        private readonly ITypeInfoExtractor typeInfoExtractor;
        private readonly ICustomPropertyValueExtractor customPropertyValueExtractor;
        private readonly ICustomPropertyTypeResolver customPropertyTypeResolver;

        public ValueExtractor(
            ITypeInfoExtractor typeInfoExtractor,
            ICustomPropertyValueExtractor customPropertyValueExtractor,
            ICustomPropertyTypeResolver customPropertyTypeResolver
        )
        {
            this.typeInfoExtractor = typeInfoExtractor;
            this.customPropertyValueExtractor = customPropertyValueExtractor;
            this.customPropertyTypeResolver = customPropertyTypeResolver;
        }

        public object ExtractValue(Type type, object o)
        {
            var typeInfo = typeInfoExtractor.Extract(type);
            return ExtractValue(typeInfo, type, o);
        }

        private object ExtractValue(TypeInfo typeInfo, Type type, object o)
        {
            if (typeInfo is ClassTypeInfo classTypeInfo)
            {
                var properties = classTypeInfo.Properties;
                var result = new Dictionary<string, object>();
                foreach (var property in properties)
                {
                    var propertyInfo = type.GetProperty(property.Description.Name);
                    var propertyValue = propertyInfo.GetMethod.Invoke(o, null);
                    if (customPropertyValueExtractor != null &&
                        customPropertyValueExtractor.TryGetPropertyValue(propertyValue, propertyInfo,
                            out var customExtractionResult))
                    {
                        result[property.Description.Name] =
                            ExtractValue(
                                property.TypeInfo,
                                customPropertyTypeResolver.TryResolvePropertyType(propertyInfo),
                                customExtractionResult
                            );
                    }
                    else
                    {
                        result[property.Description.Name] =
                            ExtractValue(
                                property.TypeInfo,
                                propertyInfo.PropertyType,
                                propertyValue
                            );
                    }
                }

                return result;
            }

            return o;
        }
    }

    public class TypeInfoExtractor : ITypeInfoExtractor
    {
        private readonly ICustomPropertyTypeResolver customPropertyTypeResolver;
        private readonly IPropertyDescriptionBuilder propertyDescriptionBuilder;
        private readonly ConcurrentDictionary<Type, TypeInfo> typeInfos;

        public TypeInfoExtractor(IPropertyDescriptionBuilder propertyDescriptionBuilder,
            ICustomPropertyTypeResolver customPropertyTypeResolver)
        {
            this.customPropertyTypeResolver = customPropertyTypeResolver;
            this.propertyDescriptionBuilder = propertyDescriptionBuilder;
            typeInfos = new ConcurrentDictionary<Type, TypeInfo>();
        }

        public TypeInfo Extract(Type type)
        {
            return typeInfos.GetOrAdd(type, ResolveType);
        }

        private TypeInfo ResolveType(Type type)
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
                return new EnumerableTypeInfo(ResolveType(realType.GetElementType()));
            if (realType.IsGenericType && realType.GetGenericTypeDefinition() == typeof(List<>))
                return new EnumerableTypeInfo(ResolveType(realType.GetGenericArguments()[0]));
            if (realType.IsGenericType && realType.GetGenericTypeDefinition() == typeof(Dictionary<,>))
                return new DictionaryTypeInfo(ResolveType(realType.GetGenericArguments()[0]),
                    ResolveType(realType.GetGenericArguments()[1]));
            if (realType.IsGenericType && realType.GetGenericTypeDefinition() == typeof(HashSet<>))
                return new HashSetTypeInfo(ResolveType(realType.GetGenericArguments()[0]));
            if (realType.IsClass)
                return new ClassTypeInfo
                {
                    Properties = realType.GetProperties().Select(ResolveProperty).ToArray(),
                };

            throw new NotSupportedException($"{type.FullName} не поддерживается");
        }

        private Property ResolveProperty(PropertyInfo propertyInfo)
        {
            var typeInfo = ResolveType(customPropertyTypeResolver?.TryResolvePropertyType(propertyInfo) ??
                                       propertyInfo.PropertyType);
            return new Property
            {
                TypeInfo = typeInfo,
                Description = propertyDescriptionBuilder.Build(propertyInfo, typeInfo),
            };
        }
    }
}