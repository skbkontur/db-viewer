using System.Threading.Tasks;

using SkbKontur.DbViewer.Connector;
using SkbKontur.DbViewer.DataTypes;

#pragma warning disable 1998

namespace SkbKontur.DbViewer.TestApi.Impl
{
    public class SampleDbConnector<T> : IDbConnector<T>
        where T : class
    {
        public async Task<object[]> Search(Condition[] filters, Sort[] sorts, int from, int count)
        {
            return SampleDataBase.Get<T>().Find(filters, sorts, from, count);
        }

        public async Task<int?> Count(Condition[] filters, int? limit)
        {
            return SampleDataBase.Get<T>().Count(filters, limit);
        }

        public async Task<object> Read(Condition[] filters)
        {
            return SampleDataBase.Get<T>().Read(filters);
        }

        public async Task Delete(Condition[] filters)
        {
            SampleDataBase.Get<T>().Delete(filters);
        }

        public async Task Write(object @object)
        {
            SampleDataBase.Get<T>().Write(@object);
        }
    }
}