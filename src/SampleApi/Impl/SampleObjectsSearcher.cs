using System.Threading.Tasks;

using Kontur.DBViewer.Core.Connector;
using Kontur.DBViewer.Core.DTO;
#pragma warning disable 1998

namespace Kontur.DBViewer.SampleApi.Impl
{
    public class SampleDBConnector<T> : IDBConnector<T>
        where T : class
    {
        public async Task<object[]> Search(Filter[] filters, Sort[] sorts, int @from, int count)
        {
            // ReSharper disable once CoVariantArrayConversion
            return SampleDataBase<T>.Instance.Find(filters, sorts, from, count);
        }

        public async Task<int?> Count(Filter[] filters, int? limit)
        {
            return SampleDataBase<T>.Instance.Count(filters, limit);
        }

        public async Task<object> Read(Filter[] filters)
        {
            return SampleDataBase<T>.Instance.Read(filters);
        }

        public async Task Delete(object @object)
        {
            SampleDataBase<T>.Instance.Delete((T)@object);
        }

        public async Task<object> Write(object @object)
        {
            return SampleDataBase<T>.Instance.Write((T)@object);
        }
    }
}