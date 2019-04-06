using System.Threading.Tasks;

using Kontur.DBViewer.Core.Connector;
using Kontur.DBViewer.Core.DTO;
using Kontur.DBViewer.SampleApi.Impl.Classes;

#pragma warning disable 1998

namespace Kontur.DBViewer.SampleApi.Impl
{
    public class SampleDBConnector<T> : IDBConnector<T>
        where T : class
    {
        public async Task<object[]> Search(Filter[] filters, Sort[] sorts, int @from, int count)
        {
            // ReSharper disable once CoVariantArrayConversion
            return SampleDataBase.Instance.Find(filters, sorts, from, count);
        }

        public async Task<int?> Count(Filter[] filters, int? limit)
        {
            return SampleDataBase.Instance.Count(filters, limit);
        }

        public async Task<object> Read(Filter[] filters)
        {
            return SampleDataBase.Instance.Read(filters);
        }

        public async Task Delete(object @object)
        {
            SampleDataBase.Instance.Delete((TestClass)@object);
        }

        public async Task<object> Write(object @object)
        {
            return SampleDataBase.Instance.Write((TestClass)@object);
        }
    }
}