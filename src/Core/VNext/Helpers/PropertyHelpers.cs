using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text.RegularExpressions;
using Kontur.DBViewer.Core.VNext.DataTypes;

namespace Kontur.DBViewer.Core.VNext.Helpers
{
    public class PropertyHelpers
    {
        public static void BuildGettersForProperties([NotNull] Type type, [NotNull] string currentName,
            [NotNull] Func<object, object> currentGetter,
            [NotNull, ItemNotNull] List<string> properties, [NotNull, ItemNotNull] List<Func<object, object>> getters,
            [CanBeNull] Type[] usedTypes = null)
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
                var propertyName = propertyInfo.Name;
                var propertyGetter = propertyInfo.GetGetMethod();

                var name = string.IsNullOrEmpty(currentName) ? propertyName : $"{currentName}.{propertyName}";
                Func<object, object> getter = x =>
                {
                    var o = currentGetter(x);
                    return o == null ? null : propertyGetter.Invoke(o, new object[0]);
                };

                if (IsSimpleType(propertyInfo.PropertyType))
                {
                    properties.Add(name);
                    getters.Add(getter);
                    continue;
                }

                BuildGettersForProperties(propertyInfo.PropertyType, name, getter, properties, getters, usedTypes);
            }
        }

        [NotNull]
        public static string ToString([NotNull] Func<object, object> getter, [CanBeNull] object value)
        {
            var property = getter(value);
            return ToString(property);
        }

        [CanBeNull]
        public static TypeMetaInformation BuildTypeMetaInformation([NotNull] Type type,
            [CanBeNull, ItemNotNull] Type[] usedTypes = null)
        {
            usedTypes = (usedTypes ?? new Type[0]).ToArray();
            if (usedTypes.Contains(type))
                return null;
            usedTypes = usedTypes.Concat(new[] {type}).ToArray();
            if (type.IsArray || type.HasElementType)
            {
                return new TypeMetaInformation
                {
                    TypeName = type.Name,
                    IsArray = true,
                    ItemType = BuildTypeMetaInformation(type.GetElementType(), usedTypes),
                };
            }

            if (type.IsGenericType)
            {
                return new TypeMetaInformation
                {
                    TypeName = new Regex(@"`.*").Replace(type.GetGenericTypeDefinition().Name, ""),
                    IsArray = true,
                    GenericTypeArguments = type.GetGenericArguments()
                        .Select(x => BuildTypeMetaInformation(x, usedTypes)).ToArray(),
                };
            }

            return new TypeMetaInformation
            {
                TypeName = type.Name,
                Properties = IsSimpleType(type)
                    ? null
                    : type.GetProperties().Select(x => BuildPropertyInfo(x, usedTypes)).ToArray(),
            };
        }

        private static bool IsSimpleType([NotNull] Type type)
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

        [NotNull]
        private static PropertyMetaInformation BuildPropertyInfo([NotNull] PropertyInfo propertyInfo,
            [NotNull, ItemNotNull] Type[] types)
        {
            return new PropertyMetaInformation
            {
                Name = propertyInfo.Name,
                Indexed = false,
                Type = BuildTypeMetaInformation(propertyInfo.PropertyType, types),
            };
        }

        [NotNull]
        private static string ToString([CanBeNull] object property)
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