using System;

namespace SkbKontur.DbViewer.Cql.Utils.ObjectsParser.Parsers
{
    public delegate bool EnumTryParseDelegate(Type enumType, string value, out object result);
}