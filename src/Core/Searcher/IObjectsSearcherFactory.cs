namespace Kontur.DBViewer.Core.Searcher
{
    public interface IObjectsSearcherFactory
    {
        IObjectsSearcher CreateSearcher<T>();
    }
}