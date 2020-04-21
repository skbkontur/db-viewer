using System;
using System.Collections.Generic;
using System.Linq;

using SkbKontur.DbViewer.Configuration;
using SkbKontur.DbViewer.DataTypes;

namespace SkbKontur.DbViewer.Helpers
{
    public static class ObjectsConverter
    {
        public static object StoredToApi(TypeMetaInformation typeMeta, Type type, object? o, ICustomPropertyConfigurationProvider? customPropertyConfigurationProvider)
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
                var resolvedProperty = customPropertyConfiguration != null ? customPropertyConfiguration.StoredToApi(propertyValue) : propertyValue;
                var resolvedType = resolvedProperty?.GetType() ?? customPropertyConfiguration?.ResolvedType ?? propertyInfo.PropertyType;
                result[property.Name] = StoredToApi(property.Type, resolvedType, resolvedProperty, customPropertyConfigurationProvider);
            }

            return result;
        }
    }
}