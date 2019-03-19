using Kontur.DBViewer.Core.Searcher;

namespace Kontur.DBViewer.SampleApi.Impl
{
    public class SampleObjectsSearcher<T> : IObjectsSearcher<T>
        where T : class
    {
        public object[] Search(Filter[] filters, Sort[] sorts, int @from, int count)
        {
            return SampleDataBase<T>.Instance.Find(filters, sorts, from, count);
        }

        public int? Count(Filter[] filters, int? limit)
        {
            return SampleDataBase<T>.Instance.Count(filters, limit);
        }

        public object Read(Filter[] filters)
        {
            return SampleDataBase<T>.Instance.Read(filters);
        }

        public void Delete(object @object)
        {
            SampleDataBase<T>.Instance.Delete((T)@object);
        }

        public object Write(object @object)
        {
            return SampleDataBase<T>.Instance.Write((T)@object);
        }
    }
}