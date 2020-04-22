using System;
using System.Collections;
using System.Linq;

using SkbKontur.DbViewer.Configuration;

namespace SkbKontur.DbViewer.Helpers
{
    public static class ObjectPropertyEditor
    {
        public static object SetValue(object obj, string[] path, string? value, ICustomPropertyConfigurationProvider propertyConfigurator)
        {
            var objectType = obj.GetType();

            if (obj is IList list)
            {
                var type = objectType.HasElementType ? objectType.GetElementType() : objectType.GetGenericArguments()[0];
                var index = int.Parse(path[0]);
                var newValue = path.Length == 1
                                   ? ParseInternal(type, value, propertyConfigurator)
                                   : SetValue(list[index], path.Skip(1).ToArray(), value, propertyConfigurator);
                list[index] = newValue;
                return obj;
            }

            if (obj is IDictionary dictionary)
            {
                var args = objectType.GetGenericArguments();
                var key = ParseInternal(args[0], path[0], propertyConfigurator);
                var newValue = path.Length == 1
                                   ? ParseInternal(args[1], value, propertyConfigurator)
                                   : SetValue(dictionary[key], path.Skip(1).ToArray(), value, propertyConfigurator);
                dictionary[key] = newValue;
                return obj;
            }

            var property = objectType.GetProperty(path[0]);
            if (property == null)
                throw new InvalidOperationException($"Expected type {objectType} to have property {path[0]}");

            var propertyConfiguration = propertyConfigurator.TryGetConfiguration(obj, property);
            if (propertyConfiguration != null)
            {
                if (path.Length == 1)
                {
                    property.SetValue(obj, propertyConfiguration.ApiToStored(ObjectParser.Parse(propertyConfiguration.ResolvedType, value)));
                    return obj;
                }

                var oldValue = propertyConfiguration.StoredToApi(property.GetValue(obj));
                if (oldValue == null)
                    throw new InvalidOperationException($"Unable to set inner value for property {property.Name} of type {propertyConfiguration.ResolvedType}");
                var intermediateValue = SetValue(oldValue, path.Skip(1).ToArray(), value, propertyConfigurator);
                var newValue = propertyConfiguration.ApiToStored(intermediateValue);
                property.SetValue(obj, newValue);
                return obj;
            }

            var newPropertyValue = path.Length == 1
                                       ? ObjectParser.Parse(property.PropertyType, value)
                                       : SetValue(property.GetValue(obj), path.Skip(1).ToArray(), value, propertyConfigurator);
            property.SetValue(obj, newPropertyValue);
            return obj;
        }

        private static object? ParseInternal(Type type, string? value, ICustomPropertyConfigurationProvider propertyConfigurator)
        {
            var configuration = propertyConfigurator.TryGetConfiguration(type);
            var parsedObject = ObjectParser.Parse(configuration?.ResolvedType ?? type, value);
            return configuration == null ? parsedObject : configuration.ApiToStored(parsedObject);
        }
    }
}