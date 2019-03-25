using System;
using Kontur.DBViewer.Recipes.CQL.Utils.ObjectsParser.Parsers;

namespace Kontur.DBViewer.Recipes.CQL.Utils.ObjectsParser
{
    public interface IObjectParserCollection
    {
        IValueParser GetParser(Type type);
        IValueParser GetEnumParser();
    }
}