using System;

namespace Kontur.DBViewer.Recipes.CQL.Utils.ObjectsParser.Parsers
{
    public interface IValueParser
    {
        bool TryParse(Type type, string value, out object result);
    }
}