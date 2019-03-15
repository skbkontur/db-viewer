using System;
using System.Collections.Generic;
using System.Reflection;

namespace Kontur.DBViewer.Core.TypeInformation
{
    public static class FieldInfoExtractor
    {
        public static FieldInfo Extract(Type type, Func<PropertyInfo, Type, FieldMeta> metaExtractor)
        {
            return InnerExtract(type, null, metaExtractor);
        }

        private static FieldInfo InnerExtract(Type type, FieldMeta meta, Func<PropertyInfo, Type, FieldMeta> metaExtractor)
        {
            var realType = Nullable.GetUnderlyingType(type) ?? type;
            var canBeNull = Nullable.GetUnderlyingType(type) != null;
            switch(TypeToFieldTypeResolver.Resolve(type))
            {
            case FieldType.String:
                return new StringFieldInfo(meta);
            case FieldType.Int:
                return new IntFieldInfo(canBeNull, meta);
            case FieldType.Long:
                return new LongFieldInfo(canBeNull, meta);
            case FieldType.DateTime:
                return new DateTimeFieldInfo(canBeNull, meta);
            case FieldType.Bool:
                return new BoolFieldInfo(canBeNull, meta);
            case FieldType.Decimal:
                return new DecimalFieldInfo(canBeNull, meta);
            case FieldType.Enum:
                // ReSharper disable once AssignNullToNotNullAttribute
                return new EnumFieldInfo(canBeNull, Enum.GetNames(realType), meta);
            case FieldType.Enumerable:
                if(type.IsArray)
                    return new EnumerableFieldInfo(InnerExtract(type.GetElementType(), null, metaExtractor));
                if(type.IsGenericType && type.GetGenericTypeDefinition() == typeof(List<>))
                    return new EnumerableFieldInfo(InnerExtract(type.GetGenericArguments()[0], null, metaExtractor));
                throw new ArgumentOutOfRangeException();
            case FieldType.Class:
                var result = new ClassFieldInfo();
                result.Fields = new Dictionary<string, FieldInfo>();
                foreach(var property in realType.GetProperties())
                {
                    result.Fields[property.Name] = InnerExtract(property.PropertyType, metaExtractor(property, realType), metaExtractor);
                }

                return result;
            default:
                throw new ArgumentOutOfRangeException();
            }
        }
    }
}