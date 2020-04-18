using System.Threading.Tasks;

using SkbKontur.DbViewer.Connector;
using SkbKontur.DbViewer.DataTypes;
using SkbKontur.DbViewer.TestApi.Impl.Classes;

#pragma warning disable 1998

namespace SkbKontur.DbViewer.TestApi.Impl
{
    public class SampleDbConnector<T> : IDbConnector<T>
        where T : class
    {
        public async Task<object[]> Search(Condition[] filters, Sort[] sorts, int from, int count)
        {
            // ReSharper disable once CoVariantArrayConversion
            return SampleDataBase.Instance.Find(filters, sorts, from, count);
        }

        public async Task<int?> Count(Condition[] filters, int? limit)
        {
            return SampleDataBase.Instance.Count(filters, limit);
        }

        public async Task<object> Read(Condition[] filters)
        {
            return SampleDataBase.Instance.Read(filters);
        }

        public async Task Delete(Condition[] filters)
        {
            SampleDataBase.Instance.Delete(filters);
        }

        public async Task Write(object @object)
        {
            SampleDataBase.Instance.Write((TestClass)@object);
        }
    }
}