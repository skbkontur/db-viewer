using System;

using SkbKontur.DbViewer.Cql.Utils.ObjectsParser.Parsers;

namespace SkbKontur.DbViewer.Cql.Utils.ObjectsParser
{
    public interface IObjectParserCollection
    {
        IValueParser GetParser(Type type);
        IValueParser GetEnumParser();
    }
}