using System;

namespace SkbKontur.DbViewer.Cql.Utils.ObjectsParser
{
    internal static class ObjectParser
    {
        public static object Parse(Type type, string value)
        {
            object result;
            if (type.IsEnum)
            {
                if (collection.GetEnumParser().TryParse(type, value, out result))
                    return result;
                return Default(type);
            }

            if (collection.GetParser(type).TryParse(type, value, out result))
                return result;
            return Default(type);
        }

        private static object Default(Type type)
        {
            if (type.IsValueType)
                return Activator.CreateInstance(type);
            return null;
        }

        private static readonly IObjectParserCollection collection = new ObjectParserCollectionNullableWrapper(ObjectParserConfiguration.CreateDefault());
    }
}