using System;
using System.Collections.Generic;
using System.Linq;

namespace SkbKontur.DbViewer.VNext.Helpers
{
    public interface IObjectPropertyEditor
    {
        Action<object, object> BuildSetter(Type objectType, string path);
        Type GetPropertyType(Type objectType, string path);
    }

    public class ObjectPropertyEditor : IObjectPropertyEditor
    {
        public Action<object, object> BuildSetter(Type objectType, string path)
        {
            var pathParts = path.Split('.');
            var propertyGetter = GetPropertyGetter(objectType, pathParts.Take(pathParts.Length - 1));
            var propertyType = propertyGetter.Item1;
            var getter = propertyGetter.Item2;
            var lastPropertyName = pathParts.Last();
            if (propertyType.IsArray)
            {
                if (!int.TryParse(lastPropertyName, out var index))
                    throw new Exception($"Invalid array index: {lastPropertyName}");
                var oldGetter = getter;
                return (obj, value) =>
                    {
                        var array = (Array)oldGetter(obj);
                        if (index < 0 || index > array.Length)
                            throw new Exception($"Array index {index} is out of array bounds");
                        array.SetValue(value, index);
                    };
            }

            var property = propertyType.GetProperty(lastPropertyName);
            if (property == null)
                throw new Exception($"Type {propertyType.FullName} doesn't have property {lastPropertyName}");
            var setter = property.GetSetMethod(true);
            return (obj, value) => setter.Invoke(getter(obj), new[] {value});
        }

        public Type GetPropertyType(Type objectType, string path)
        {
            return GetPropertyGetter(objectType, path.Split('.')).Item1;
        }

        private static Tuple<Type, Func<object, object>> GetPropertyGetter(Type objectType, IEnumerable<string> enumerable)
        {
            var type = objectType;
            Func<object, object> getter = x => x;
            foreach (var pathPart in enumerable)
            {
                if (type.IsArray)
                {
                    if (!int.TryParse(pathPart, out var index))
                        throw new Exception($"Invalid array index: {pathPart}");
                    var oldGetter = getter;
                    getter = obj =>
                        {
                            var array = (Array)oldGetter(obj);
                            if (index < 0 || index > array.Length)
                                throw new Exception($"Array index {index} is out of array bounds");
                            return array.GetValue(index);
                        };
                    type = type.GetElementType();
                }
                else
                {
                    var property = type.GetProperty(pathPart);
                    if (property == null)
                        throw new Exception($"Type {type.FullName} doesn't have property {pathPart}");
                    var propertyGetter = property.GetGetMethod();
                    var oldGetter = getter;
                    getter = obj => propertyGetter.Invoke(oldGetter(obj), new object[0]);
                    type = property.PropertyType;
                }
            }

            return Tuple.Create(type, getter);
        }
    }
}