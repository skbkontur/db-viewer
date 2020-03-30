namespace SkbKontur.DbViewer.Cql.Utils.ObjectsParser.Parsers
{
    public delegate bool TryParseDelegate<T>(string s, out T result);
}