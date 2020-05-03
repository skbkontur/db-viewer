using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

using SkbKontur.DbViewer.Configuration;
using SkbKontur.DbViewer.DataTypes;

namespace SkbKontur.DbViewer.Helpers
{
    public static class ObjectsConverter
    {
        public static object StoredToApi(Type type, object? o, ICustomPropertyConfigurationProvider? customPropertyConfigurationProvider)
        {
            if (o == null)
                return null;

            var properties = type.GetProperties(BindingFlags.Public | BindingFlags.Instance);
            if (PropertyHelpers.IsSimpleType(type) || !properties.Any())
                return o;

            var result = new Dictionary<string, object?>();
            foreach (var propertyInfo in properties)
            {
                var propertyValue = propertyInfo.GetValue(o);
                var customPropertyConfiguration = customPropertyConfigurationProvider?.TryGetConfiguration(o, propertyInfo);
                var resolvedProperty = customPropertyConfiguration != null ? customPropertyConfiguration.StoredToApi(propertyValue) : propertyValue;
                result[propertyInfo.Name] = resolvedProperty;
            }

            return result;
        }

        public static object StoredToApiDeep(Type type, object? o, ICustomPropertyConfigurationProvider? customPropertyConfigurationProvider)
        {
            if (o == null)
                return null;

            if (o is IDictionary dictionary)
                return dictionary.Keys.Cast<object>().ToDictionary(
                    k => StoredToApiInternal(type.GetGenericArguments()[0], k, customPropertyConfigurationProvider),
                    k => StoredToApiInternal(type.GetGenericArguments()[1], dictionary[k], customPropertyConfigurationProvider)
                );

            if (!PropertyHelpers.IsSimpleType(type) && type != typeof(byte[]) && o is IEnumerable enumerable)
                return enumerable.Cast<object>().Select(
                    x => StoredToApiInternal(
                        type.HasElementType ? type.GetElementType() : type.GetGenericArguments()[0],
                        x, customPropertyConfigurationProvider
                    )
                ).ToArray();

            var properties = type.GetProperties(BindingFlags.Public | BindingFlags.Instance);
            if (PropertyHelpers.IsSimpleType(type) || type == typeof(byte[]) || !properties.Any())
                return o;

            var result = new Dictionary<string, object>();
            foreach (var propertyInfo in properties)
            {
                var propertyValue = propertyInfo.GetValue(o);
                var customPropertyConfiguration = customPropertyConfigurationProvider?.TryGetConfiguration(o, propertyInfo);
                var resolvedProperty = customPropertyConfiguration != null ? customPropertyConfiguration.StoredToApi(propertyValue) : propertyValue;
                var resolvedType = resolvedProperty?.GetType() ?? customPropertyConfiguration?.ResolvedType ?? propertyInfo.PropertyType;
                result[propertyInfo.Name] = StoredToApiDeep(resolvedType, resolvedProperty, customPropertyConfigurationProvider);
            }

            return result;
        }

        private static object StoredToApiInternal(Type type, object? o, ICustomPropertyConfigurationProvider? customPropertyConfigurationProvider)
        {
            var objectConfigurator = customPropertyConfigurationProvider?.TryGetConfiguration(type);
            return StoredToApiDeep(
                objectConfigurator?.ResolvedType ?? type,
                objectConfigurator != null ? objectConfigurator.StoredToApi(o) : o,
                customPropertyConfigurationProvider
            );
        }
    }
}