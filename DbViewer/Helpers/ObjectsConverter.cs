using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

using SkbKontur.DbViewer.Configuration;

namespace SkbKontur.DbViewer.Helpers
{
    public static class ObjectsConverter
    {
        public static object StoredToApi(Type type, object? o, ICustomPropertyConfigurationProvider? customPropertyConfigurationProvider)
        {
            if (o == null)
                return null;

            var properties = type.GetProperties(BindingFlags.Public | BindingFlags.Instance);
            if (PropertyHelpers.IsSimpleType(type) || type == typeof(byte[]) || !properties.Any())
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

        public static object StoredToApiDeep(object? o, ICustomPropertyConfigurationProvider? customPropertyConfigurationProvider)
        {
            if (o == null)
                return null;

            if (o is IDictionary dictionary)
                return dictionary.Keys.Cast<object>().ToDictionary(
                    k => StoredToApiInternal(k, customPropertyConfigurationProvider),
                    k => StoredToApiInternal(dictionary[k], customPropertyConfigurationProvider)
                );

            var type = o.GetType();
            if (!PropertyHelpers.IsSimpleType(type) && type != typeof(byte[]) && o is IEnumerable enumerable)
                return enumerable.Cast<object>().Select(x => StoredToApiInternal(x, customPropertyConfigurationProvider)).ToArray();

            var properties = type.GetProperties(BindingFlags.Public | BindingFlags.Instance);
            if (PropertyHelpers.IsSimpleType(type) || type == typeof(byte[]) || !properties.Any())
                return o;

            var result = new Dictionary<string, object>();
            foreach (var propertyInfo in properties)
            {
                var propertyValue = propertyInfo.GetValue(o);
                var customPropertyConfiguration = customPropertyConfigurationProvider?.TryGetConfiguration(o, propertyInfo);
                var resolvedProperty = customPropertyConfiguration != null ? customPropertyConfiguration.StoredToApi(propertyValue) : propertyValue;
                result[propertyInfo.Name] = StoredToApiDeep(resolvedProperty, customPropertyConfigurationProvider);
            }

            return result;
        }

        private static object StoredToApiInternal(object? o, ICustomPropertyConfigurationProvider? customPropertyConfigurationProvider)
        {
            var objectConfigurator = o == null ? null : customPropertyConfigurationProvider?.TryGetConfiguration(o.GetType());
            return StoredToApiDeep(
                objectConfigurator != null ? objectConfigurator.StoredToApi(o) : o,
                customPropertyConfigurationProvider
            );
        }
    }
}