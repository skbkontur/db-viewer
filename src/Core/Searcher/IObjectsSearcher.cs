namespace Kontur.DBViewer.Core.Searcher
{
    public interface IObjectsSearcher
    {
        object[] Search(Filter[] filters, Sort[] sorts, int from, int count);
        int? Count(Filter[] filters, int? limit);
        object Read(Filter[] filters);
        void Delete(object @object);
        object Write(object @object);
    }

    public interface IObjectsSearcher<T> : IObjectsSearcher
    {
    }
}