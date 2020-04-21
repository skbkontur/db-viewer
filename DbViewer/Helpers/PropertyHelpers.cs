using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text.RegularExpressions;

using SkbKontur.DbViewer.Configuration;
using SkbKontur.DbViewer.DataTypes;

namespace SkbKontur.DbViewer.Helpers
{
    public static class PropertyHelpers
    {
        public static void BuildGettersForProperties(Type type, string currentName, Func<object?, object?> currentGetter,
                                                     List<string> properties, List<Func<object?, object?>> getters,
                                                     ICustomPropertyConfigurationProvider propertyConfigurationProvider,
                                                     Type[]? usedTypes = null)
        {
            usedTypes = (usedTypes ?? new Type[0]).ToArray();
            if (usedTypes.Contains(type) || typeof(IEnumerable).IsAssignableFrom(type))
            {
                properties.Add(currentName);
                getters.Add(currentGetter);
                return;
            }

            usedTypes = usedTypes.Concat(new[] {type}).ToArray();
            foreach (var propertyInfo in type.GetProperties(BindingFlags.Public | BindingFlags.Instance))
            {
                var propertyConfiguration = propertyConfigurationProvider.TryGetConfiguration(propertyInfo);
                var propertyType = propertyConfiguration?.ResolvedType ?? propertyInfo.PropertyType;
                var propertyName = propertyInfo.Name;
                var propertyGetter = propertyInfo.GetGetMethod();

                var name = string.IsNullOrEmpty(currentName) ? propertyName : $"{currentName}.{propertyName}";
                Func<object?, object?> getter = x =>
                    {
                        var o = currentGetter(x);
                        if (o == null)
                            return null;

                        var propertyValue = propertyGetter.Invoke(o, new object[0]);
                        return propertyConfiguration == null ? propertyValue : propertyConfiguration.StoredToApi(propertyValue);
                    };

                if (IsSimpleType(propertyType))
                {
                    properties.Add(name);
                    getters.Add(getter);
                    continue;
                }

                BuildGettersForProperties(propertyType, name, getter, properties, getters, propertyConfigurationProvider, usedTypes);
            }
        }

        public static string ToString(Func<object?, object?> getter, object? value)
        {
            var property = getter(value);
            return ToString(property);
        }

        public static TypeMetaInformation BuildTypeMetaInformation(object? @object, Type type, IPropertyDescriptionBuilder propertyDescriptionBuilder,
                                                                   ICustomPropertyConfigurationProvider propertyConfigurationProvider,
                                                                   Type[]? usedTypes = null)
        {
            usedTypes = (usedTypes ?? new Type[0]).ToArray();
            if (usedTypes.Contains(type))
                return null;
            usedTypes = usedTypes.Concat(new[] {type}).ToArray();

            if (type.IsGenericType && type.GetGenericTypeDefinition() == typeof(Nullable<>))
                return TypeMetaInformation.ForSimpleType(type.GetGenericArguments()[0].Name, isNullable : true);

            if (IsSimpleType(type))
                return TypeMetaInformation.ForSimpleType(type.Name);

            var typeName = new Regex(@"`.*").Replace(type.Name, "");

            if (typeof(IEnumerable).IsAssignableFrom(type))
            {
                var genericArguments = type.HasElementType ? new[] {type.GetElementType()} : type.GetGenericArguments();
                return new TypeMetaInformation
                    {
                        TypeName = typeName,
                        IsArray = true,
                        Properties = new PropertyMetaInformation[0],
                        GenericTypeArguments = genericArguments
                                               .Select(x => BuildTypeMetaInformation(null, x, propertyDescriptionBuilder, propertyConfigurationProvider, usedTypes))
                                               .ToArray(),
                    };
            }

            return new TypeMetaInformation
                {
                    TypeName = typeName,
                    Properties = type.GetProperties(BindingFlags.Public | BindingFlags.Instance)
                                     .Select(x => BuildPropertyInfo(@object, x, propertyDescriptionBuilder, propertyConfigurationProvider, usedTypes))
                                     .ToArray(),
                    GenericTypeArguments = type.GetGenericArguments()
                                               .Select(x => BuildTypeMetaInformation(null, x, propertyDescriptionBuilder, propertyConfigurationProvider, usedTypes))
                                               .ToArray(),
                };
        }

        private static PropertyMetaInformation BuildPropertyInfo(object? @object, PropertyInfo propertyInfo,
                                                                 IPropertyDescriptionBuilder propertyDescriptionBuilder,
                                                                 ICustomPropertyConfigurationProvider propertyConfigurationProvider,
                                                                 Type[] types)
        {
            object? objectProperty;
            Type propertyType;
            if (@object == null)
            {
                var customConfiguration = propertyConfigurationProvider.TryGetConfiguration(propertyInfo);
                objectProperty = null;
                propertyType = customConfiguration?.ResolvedType ?? propertyInfo.PropertyType;
            }
            else
            {
                var customConfiguration = propertyConfigurationProvider.TryGetConfiguration(@object, propertyInfo);
                var underlyingProperty = propertyInfo.GetValue(@object);
                objectProperty = customConfiguration != null ? customConfiguration.StoredToApi(underlyingProperty) : underlyingProperty;
                var resolvedType = customConfiguration?.ResolvedType ?? propertyInfo.PropertyType;
                var objectPropertyType = IsSimpleType(resolvedType) ? null : objectProperty?.GetType();
                propertyType = objectPropertyType ?? resolvedType;
            }

            var underlyingType = propertyType.IsGenericType && propertyType.GetGenericTypeDefinition() == typeof(Nullable<>) ? propertyType.GetGenericArguments()[0] : propertyType;
            var propertyDescription = propertyDescriptionBuilder.Build(propertyInfo, propertyType);
            return new PropertyMetaInformation
                {
                    Name = propertyInfo.Name,
                    AvailableFilters = propertyDescription.AvailableFilters,
                    AvailableValues = underlyingType.IsEnum ? Enum.GetNames(underlyingType) : new string[0],
                    IsEditable = propertyInfo.SetMethod != null,
                    IsIdentity = propertyDescription.IsIdentity,
                    IsRequired = propertyDescription.IsRequired,
                    IsSearchable = propertyDescription.IsSearchable,
                    IsSortable = propertyDescription.IsSortable,
                    Type = BuildTypeMetaInformation(objectProperty, propertyType, propertyDescriptionBuilder, propertyConfigurationProvider, types),
                };
        }

        public static bool IsSimpleType(Type type)
        {
            return type.IsEnum ||
                   type.IsPrimitive ||
                   type.IsValueType ||
                   new[]
                       {
                           typeof(string),
                           typeof(ushort), typeof(uint), typeof(ulong),
                           typeof(short), typeof(int), typeof(long),
                       }.Contains(type);
        }

        private static string ToString(object? property)
        {
            if (property == null)
                return string.Empty;

            if (property is DateTime time)
                return time.ToString("O");

            if (property is IList collection)
                return string.Join(", ", collection.Cast<object>().Select(ToString));

            return property.ToString();
        }
    }
}