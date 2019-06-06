using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using Cassandra;
using Kontur.DBViewer.Core.DTO.TypeInfo;
using TypeInfo = Kontur.DBViewer.Core.DTO.TypeInfo.TypeInfo;

namespace Kontur.DBViewer.Core.TypeAndObjectBulding
{
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
            if (realType == typeof(string) || realType == typeof(Guid) || realType == typeof(TimeUuid))
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
            if (realType == typeof(decimal) ||realType == typeof(double))
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