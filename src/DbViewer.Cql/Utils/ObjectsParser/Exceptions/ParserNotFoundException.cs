using System;
using System.Linq;

namespace SkbKontur.DbViewer.Cql.Utils.ObjectsParser.Exceptions
{
    internal class ParserNotFoundException : Exception
    {
        public ParserNotFoundException(Type t)
            : base($"Parser for type '{GetFriendlyName(t)}' not found.")
        {
        }

        public ParserNotFoundException(string parserDescription)
            : base($"Parser '{parserDescription}' not found.")
        {
        }

        private static string GetFriendlyName(Type type)
        {
            if (type == typeof(int))
                return "int";
            if (type == typeof(short))
                return "short";
            if (type == typeof(byte))
                return "byte";
            if (type == typeof(bool))
                return "bool";
            if (type == typeof(long))
                return "long";
            if (type == typeof(float))
                return "float";
            if (type == typeof(double))
                return "double";
            if (type == typeof(decimal))
                return "decimal";
            if (type == typeof(string))
                return "string";
            if (type.IsGenericType)
                return type.Name.Split('`')[0] + "<" + string.Join(", ", type.GetGenericArguments().Select(GetFriendlyName)) + ">";
            return type.Name;
        }
    }
}