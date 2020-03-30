using System;

namespace SkbKontur.DbViewer.Cql.Utils.ObjectsParser.Parsers
{
    public interface IValueParser
    {
        bool TryParse(Type type, string value, out object result);
    }
}