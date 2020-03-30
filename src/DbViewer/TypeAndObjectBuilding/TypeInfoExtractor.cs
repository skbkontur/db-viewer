using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

using SkbKontur.DbViewer.Dto.TypeInfo;

using TypeInfo = SkbKontur.DbViewer.Dto.TypeInfo.TypeInfo;

namespace SkbKontur.DbViewer.TypeAndObjectBuilding
{
    public static class TypeInfoExtractor
    {
        public static TypeInfo Extract(Type type, IPropertyDescriptionBuilder propertyDescriptionBuilder,
                                       ICustomPropertyConfigurationProvider customPropertyConfigurationProvider)
        {
            return typeInfos.GetOrAdd(type,
                                      t => ResolveType(null, t, propertyDescriptionBuilder, customPropertyConfigurationProvider));
        }

        public static TypeInfo Extract(object @object, Type type,
                                       IPropertyDescriptionBuilder propertyDescriptionBuilder,
                                       ICustomPropertyConfigurationProvider customPropertyConfigurationProvider)
        {
            return ResolveType(@object, type, propertyDescriptionBuilder, customPropertyConfigurationProvider);
        }

        private static TypeInfo ResolveType(object @object, Type type,
                                            IPropertyDescriptionBuilder propertyDescriptionBuilder,
                                            ICustomPropertyConfigurationProvider customPropertyConfigurationProvider)
        {
            var realType = Nullable.GetUnderlyingType(type) ?? type;
            var canBeNull = Nullable.GetUnderlyingType(type) != null;
            if (realType == typeof(string) || realType == typeof(Guid))
                return new StringTypeInfo();
            if (realType == typeof(char))
                return new CharTypeInfo(canBeNull);
            if (realType == typeof(byte))
                return new ByteTypeInfo(canBeNull);
            if (realType == typeof(sbyte))
                return new SByteTypeInfo(canBeNull);
            if (realType == typeof(int))
                return new IntTypeInfo(canBeNull);
            if (realType == typeof(DateTime) || realType == typeof(DateTimeOffset))
                return new DateTimeTypeInfo(canBeNull);
            if (realType == typeof(long))
                return new LongTypeInfo(canBeNull);
            if (realType == typeof(short))
                return new ShortTypeInfo(canBeNull);
            if (realType == typeof(bool))
                return new BoolTypeInfo(canBeNull);
            if (realType == typeof(byte[]))
                return new ByteArrayTypeInfo();
            if (realType == typeof(decimal) || realType == typeof(double))
                return new DecimalTypeInfo(canBeNull);
            if (realType.IsEnum)
                return new EnumTypeInfo(canBeNull, Enum.GetNames(realType));
            if (realType.IsArray)
                return new EnumerableTypeInfo(ResolveType(null, realType.GetElementType(), propertyDescriptionBuilder,
                                                          customPropertyConfigurationProvider));
            if (realType.IsGenericType && realType.GetGenericTypeDefinition() == typeof(List<>))
                return new EnumerableTypeInfo(ResolveType(null, realType.GetGenericArguments()[0],
                                                          propertyDescriptionBuilder,
                                                          customPropertyConfigurationProvider));
            if (realType.IsGenericType && realType.GetGenericTypeDefinition() == typeof(Dictionary<,>))
                return new DictionaryTypeInfo(
                    ResolveType(null, realType.GetGenericArguments()[0], propertyDescriptionBuilder,
                                customPropertyConfigurationProvider),
                    ResolveType(null, realType.GetGenericArguments()[1], propertyDescriptionBuilder,
                                customPropertyConfigurationProvider));
            if (realType.IsGenericType && realType.GetGenericTypeDefinition() == typeof(HashSet<>))
                return new HashSetTypeInfo(ResolveType(null, realType.GetGenericArguments()[0],
                                                       propertyDescriptionBuilder,
                                                       customPropertyConfigurationProvider));
            if (realType.IsClass)
                return new ClassTypeInfo
                    {
                        Properties = realType.GetProperties(BindingFlags.Public | BindingFlags.Instance).Select(p =>
                                                                                                                    ResolveProperty(@object, p, propertyDescriptionBuilder,
                                                                                                                                    customPropertyConfigurationProvider))
                                             .ToArray(),
                    };

            throw new NotSupportedException($"{type.FullName} не поддерживается");
        }

        private static Property ResolveProperty(object @object, PropertyInfo propertyInfo,
                                                IPropertyDescriptionBuilder propertyDescriptionBuilder,
                                                ICustomPropertyConfigurationProvider customPropertyConfigurationProvider)
        {
            var configuration = @object == null
                                    ? customPropertyConfigurationProvider?.TryGetConfiguration(propertyInfo)
                                    : customPropertyConfigurationProvider?.TryGetConfiguration(@object, propertyInfo);
            var typeInfo = ResolveType(null,
                                       configuration?.ResolvedType ?? propertyInfo.PropertyType,
                                       propertyDescriptionBuilder,
                                       customPropertyConfigurationProvider
            );
            return new Property
                {
                    TypeInfo = typeInfo,
                    Description = propertyDescriptionBuilder.Build(propertyInfo, configuration?.ResolvedType ?? propertyInfo.PropertyType),
                };
        }

        private static readonly ConcurrentDictionary<Type, TypeInfo> typeInfos =
            new ConcurrentDictionary<Type, TypeInfo>();
    }
}