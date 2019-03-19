using Kontur.DBViewer.Core.Searcher;

namespace Kontur.DBViewer.SampleApi.Impl
{
    public class SampleObjectsSearcherFactory : IObjectsSearcherFactory
    {
        public IObjectsSearcher CreateSearcher<T>()
            where T: class 
        {
            return new SampleObjectsSearcher<T>();
        }
    }
}