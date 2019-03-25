namespace Kontur.DBViewer.Recipes.CQL.Utils.ObjectsParser.Parsers
{
    public delegate bool TryParseDelegate<T>(string s, out T result);
}