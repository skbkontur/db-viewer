using System;
using System.Collections;
using System.Linq;

using SkbKontur.DbViewer.TypeAndObjectBuilding;

namespace SkbKontur.DbViewer.Helpers
{
    public static class ObjectPropertyEditor
    {
        public static object SetValue(object obj, string[] path, string value, ICustomPropertyConfigurationProvider propertyConfigurator)
        {
            var objectType = obj.GetType();

            if (obj is IList list)
            {
                var type = objectType.HasElementType ? objectType.GetElementType() : objectType.GetGenericArguments()[0];
                var index = int.Parse(path[0]);
                var newValue = path.Length == 1
                                   ? ObjectParser.Parse(type, value)
                                   : SetValue(list[index], path.Skip(1).ToArray(), value, propertyConfigurator);
                list[index] = newValue;
                return obj;
            }

            if (obj is IDictionary dictionary)
            {
                var args = objectType.GetGenericArguments();
                var key = ObjectParser.Parse(args[0], path[0]);
                var newValue = path.Length == 1
                                   ? ObjectParser.Parse(args[1], value)
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
    }
}