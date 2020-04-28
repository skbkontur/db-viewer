using System.Linq;
using System.Threading.Tasks;

using Cassandra.Data.Linq;

using SkbKontur.DbViewer.Connector;
using SkbKontur.DbViewer.Cql.Utils;
using SkbKontur.DbViewer.DataTypes;

namespace SkbKontur.DbViewer.Cql
{
    public class CqlDbConnector<T> : IDbConnector
        where T : class
    {
        public CqlDbConnector(Table<T> table, ITimestampProvider timestampProvider)
        {
            this.table = table;
            this.timestampProvider = timestampProvider;
        }

        public async Task<object[]> Search(Condition[] filters, Sort[] sorts, int from, int count)
        {
            var query = CqlQueryHelper.BuildQuery(table, filters, sorts).Take(count);
            var results = await query.ExecuteAsync().ConfigureAwait(false);
            return results.Cast<object>().ToArray();
        }

        public Task<int?> Count(Condition[] filters, int limit)
        {
            return Task.FromResult((int?)null);
        }

        public Task<object?> Read(Condition[] filters) => CqlQueryHelper.Read(table, filters);
        public Task Delete(Condition[] filters) => CqlQueryHelper.Delete(table, timestampProvider, filters);
        public Task Write(object @object) => CqlQueryHelper.Write(table, timestampProvider, @object);

        private readonly Table<T> table;
        private readonly ITimestampProvider timestampProvider;
    }
}