using System;
using System.Collections.Generic;
using System.Linq;

using SkbKontur.DbViewer.Configuration;
using SkbKontur.DbViewer.DataTypes;

namespace SkbKontur.DbViewer.Helpers
{
    public static class ObjectsConverter
    {
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