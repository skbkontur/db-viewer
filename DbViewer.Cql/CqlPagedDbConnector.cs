using System.Linq;
using System.Threading.Tasks;

using Cassandra.Data.Linq;

using SkbKontur.DbViewer.Connector;
using SkbKontur.DbViewer.Cql.Utils;
using SkbKontur.DbViewer.DataTypes;

namespace SkbKontur.DbViewer.Cql
{
    public class CqlPagedDbConnector<T> : IDbConnector
        where T : class
    {
        public CqlPagedDbConnector(Table<T> table, ITimestampProvider timestampProvider)
        {
            this.table = table;
            this.timestampProvider = timestampProvider;
        }

        public async Task<object[]> Search(Condition[] filters, Sort[] sorts, int from, int count)
        {
            var resultQuery = CqlQueryHelper.BuildQuery(table, filters, sorts).SetPageSize(count);
            if (from > 0)
            {
                var pagedSkip = await CqlQueryHelper.BuildQuery(table, filters, sorts)
                                                    .SetPageSize(from)
                                                    .ExecutePagedAsync()
                                                    .ConfigureAwait(false);
                resultQuery.SetPagingState(pagedSkip.PagingState);
            }

            var result = await resultQuery.ExecutePagedAsync().ConfigureAwait(false);
            return result.Cast<object>().ToArray();
        }

        public async Task<int?> Count(Condition[] filters, int limit)
        {
            var query = CqlQueryHelper.BuildQuery(table, filters).Take(limit);
            var results = await query.ExecuteAsync().ConfigureAwait(false);
            return results.Count();
        }

        public Task<object?> Read(Condition[] filters) => CqlQueryHelper.Read(table, filters);
        public Task Delete(Condition[] filters) => CqlQueryHelper.Delete(table, timestampProvider, filters);
        public Task Write(object @object) => CqlQueryHelper.Write(table, timestampProvider, @object);

        private readonly Table<T> table;
        private readonly ITimestampProvider timestampProvider;
    }
}