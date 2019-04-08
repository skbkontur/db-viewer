using System;
using System.Collections.Generic;
using Kontur.DBViewer.Core.DTO.TypeInfo;
using Newtonsoft.Json.Linq;

namespace Kontur.DBViewer.Core.TypeAndObjectBulding
{
    public static class ObjectsConverter
    {
        public static object ApiToStored(TypeInfo typeInfo, Type type, object o,
            ICustomPropertyConfigurationProvider customPropertyConfigurationProvider)
        {
            var jObject = (JToken) o;
            if (jObject == null || jObject.ToString() == "")
                return null;
            if (!(typeInfo is ClassTypeInfo classTypeInfo))
                return jObject.ToObject(type);

            var result = Activator.CreateInstance(type);
            foreach (var property in classTypeInfo.Properties)
            {
                var propertyInfo = type.GetProperty(property.Description.Name);
                var customPropertyConfiguration =
                    customPropertyConfigurationProvider?.TryGetConfiguration(propertyInfo);
                var value = ApiToStored(
                    property.TypeInfo,
                    customPropertyConfiguration?.ResolvedType ?? propertyInfo.PropertyType,
                    jObject.SelectToken(property.Description.Name),
                    customPropertyConfigurationProvider
                );
                if (customPropertyConfiguration != null)
                {
                    value =
                        customPropertyConfiguration.ApiToStored(value);
                }

                propertyInfo.SetValue(result, value);
            }

            return result;
        }

        public static object StoredToApi(TypeInfo typeInfo, Type type, object o,
            ICustomPropertyConfigurationProvider customPropertyConfigurationProvider)
        {
            if (o == null)
                return null;
            if (!(typeInfo is ClassTypeInfo classTypeInfo))
                return o;

            var result = new Dictionary<string, object>();
            foreach (var property in classTypeInfo.Properties)
            {
                var propertyInfo = type.GetProperty(property.Description.Name);
                var propertyValue = propertyInfo.GetValue(o);
                var customPropertyConfiguration =
                    customPropertyConfigurationProvider?.TryGetConfiguration(propertyInfo);
                if (customPropertyConfiguration != null)
                {
                    result[property.Description.Name] =
                        StoredToApi(
                            property.TypeInfo,
                            customPropertyConfiguration.ResolvedType,
                            customPropertyConfiguration.StoredToApi(propertyValue),
                            customPropertyConfigurationProvider
                        );
                }
                else
                {
                    result[property.Description.Name] =
                        StoredToApi(
                            property.TypeInfo,
                            propertyInfo.PropertyType,
                            propertyValue,
                            customPropertyConfigurationProvider
                        );
                }
            }

            return result;
        }
    }
}