using System;

namespace Kontur.DBViewer.Recipes.CQL.Utils.ObjectsParser.Parsers
{
    public delegate bool EnumTryParseDelegate(Type enumType, string value, out object result);
}