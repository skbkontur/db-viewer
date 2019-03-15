using System;
using System.Collections.Generic;

namespace Kontur.DBViewer.Core.TypeInformation
{
    public static class TypeToFieldTypeResolver
    {
        public static FieldType Resolve(Type initialType)
        {
            var type = Nullable.GetUnderlyingType(initialType) ?? initialType;
            if(type == typeof(string))
                return FieldType.String;
            if(type == typeof(int))
                return FieldType.Int;
            if(type == typeof(DateTime))
                return FieldType.DateTime;
            if(type == typeof(long))
                return FieldType.Long;
            if(type == typeof(bool))
                return FieldType.Bool;
            if(type == typeof(decimal))
                return FieldType.Decimal;
            if(type.IsEnum)
                return FieldType.Enum;
            if(type.IsArray)
                return FieldType.Enumerable;
            if(type.IsGenericType && type.GetGenericTypeDefinition() == typeof(List<>))
                return FieldType.Enumerable;
            if(type.IsClass)
                return FieldType.Class;
            throw new NotSupportedException();
        }
    }
}