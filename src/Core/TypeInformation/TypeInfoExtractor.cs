using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace Kontur.DBViewer.Core.TypeInformation
{
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