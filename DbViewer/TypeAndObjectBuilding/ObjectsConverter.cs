using System;
using System.Collections.Generic;
using System.Linq;

using Newtonsoft.Json.Linq;

using SkbKontur.DbViewer.DataTypes;

namespace SkbKontur.DbViewer.TypeAndObjectBuilding
{
    public static class ObjectsConverter
    {
        public static object ApiToStored(TypeMetaInformation typeMeta, Type type, object o, ICustomPropertyConfigurationProvider customPropertyConfigurationProvider)
        {
            var jObject = (JToken)o;
            if (jObject == null || jObject.ToString() == "")
                return null;
            if (!typeMeta.Properties.Any())
                return jObject.ToObject(type);

            var result = Activator.CreateInstance(type);
            foreach (var property in typeMeta.Properties)
            {
                var propertyInfo = type.GetProperty(property.Name);
                var customPropertyConfiguration = customPropertyConfigurationProvider?.TryGetConfiguration(o, propertyInfo);
                var value = ApiToStored(property.Type,
                                        customPropertyConfiguration?.ResolvedType ?? propertyInfo.PropertyType,
                                        jObject.SelectToken(property.Name),
                                        customPropertyConfigurationProvider);
                if (customPropertyConfiguration != null)
                    value = customPropertyConfiguration.ApiToStored(value);

                if (propertyInfo.SetMethod != null)
                    propertyInfo.SetValue(result, value);
            }

            return result;
        }

        public static object StoredToApi(TypeMetaInformation typeMeta, Type type, object o, ICustomPropertyConfigurationProvider customPropertyConfigurationProvider)
        {
            if (o == null)
                return null;
            if (!typeMeta.Properties.Any())
                return o;

            var result = new Dictionary<string, object>();
            foreach (var property in typeMeta.Properties)
            {
                var propertyInfo = type.GetProperty(property.Name);
                var propertyValue = propertyInfo.GetValue(o);
                var customPropertyConfiguration = customPropertyConfigurationProvider?.TryGetConfiguration(o, propertyInfo);
                if (customPropertyConfiguration != null)
                {
                    result[property.Name] = StoredToApi(property.Type,
                                                        customPropertyConfiguration.ResolvedType,
                                                        customPropertyConfiguration.StoredToApi(propertyValue),
                                                        customPropertyConfigurationProvider);
                }
                else
                {
                    result[property.Name] = StoredToApi(property.Type,
                                                        propertyInfo.PropertyType,
                                                        propertyValue,
                                                        customPropertyConfigurationProvider);
                }
            }

            return result;
        }
    }
}