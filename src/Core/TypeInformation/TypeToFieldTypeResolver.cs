using System;
using System.Collections.Generic;

namespace Kontur.DBViewer.Core.TypeInformation
{
    public static class TypeToFieldTypeResolver
    {
        public static FieldType Resolve(Type initialType)
        {
            var type = Nullable.GetUnderlyingType(initialType) ?? initialType;
            if(type == typeof(string) || type == typeof(Guid))
                return FieldType.String;
            if(type == typeof(byte))
                return FieldType.Byte;
            if(type == typeof(char))
                return FieldType.Char;
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
            if(type.IsGenericType && type.GetGenericTypeDefinition() == typeof(Dictionary<,>))
                return FieldType.Dictionary;
            if(type.IsGenericType && type.GetGenericTypeDefinition() == typeof(HashSet<>))
                return FieldType.HashSet;
            if(type.IsClass)
                return FieldType.Class;
            throw new NotSupportedException();
        }
    }
}