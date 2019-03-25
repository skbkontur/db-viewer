using System;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Cassandra.Data.Linq;
using Kontur.DBViewer.Core.Connector;
using Kontur.DBViewer.Core.DTO;
using Kontur.DBViewer.Recipes.CQL.Utils;

namespace Kontur.DBViewer.Recipes.CQL
{
    public class CqlDBConnector<T> : IDBConnector
        where T : class
    {
        private readonly Table<T> table;
        private readonly ITimestampProvider timestampProvider;

        public CqlDBConnector(Table<T> table, ITimestampProvider timestampProvider)
        {
            this.table = table;
            this.timestampProvider = timestampProvider;
        }

        public async Task<object[]> Search(Filter[] filters, Sort[] sorts, int @from, int count)
        {
            // ReSharper disable once CoVariantArrayConversion
            return (await table.Where(BuildPredicate(filters)).SetPageSize(count).ExecutePagedAsync().ConfigureAwait(false)).ToArray();
        }

        public Task<int?> Count(Filter[] filters, int? limit)
        {
            return Task.FromResult((int?)null);
        }

        public async Task<object> Read(Filter[] filters)
        {
            return (await table.Where(BuildPredicate(filters)).ExecuteAsync().ConfigureAwait(false)).SingleOrDefault();
        }

        public async Task Delete(object @object)
        {
            var ts = await timestampProvider.GetTimestamp(table.Name);
            await table.Where(BuildSameIdentitiesPredicate(@object)).Delete().SetTimestamp(ts).ExecuteAsync().ConfigureAwait(false);
        }

        public async Task<object> Write(object @object)
        {
            var ts = await timestampProvider.GetTimestamp(table.Name);
            await table.Insert((T)@object).SetTimestamp(ts).ExecuteAsync().ConfigureAwait(false);
            return (await table.Where(BuildSameIdentitiesPredicate(@object)).ExecuteAsync().ConfigureAwait(false)).SingleOrDefault();
        }

        private Expression<Func<T, bool>> BuildPredicate(Filter[] filters)
        {
            return (Expression<Func<T, bool>>)CriterionHelper.BuildPredicate(typeof(T), filters);
        }

        private Expression<Func<T, bool>> BuildSameIdentitiesPredicate(object @object)
        {
            return (Expression<Func<T, bool>>)CriterionHelper.BuildSameIdentitiesPredicate(typeof(T), @object);
        }
    }
}