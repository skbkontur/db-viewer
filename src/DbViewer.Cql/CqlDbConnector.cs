using System;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

using Cassandra.Data.Linq;

using SkbKontur.DbViewer.Connector;
using SkbKontur.DbViewer.Cql.Utils;
using SkbKontur.DbViewer.Dto;
using SkbKontur.DbViewer.VNext.DataTypes;

using Sort = SkbKontur.DbViewer.Dto.Sort;

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

        public async Task<object[]> Search(Filter[] filters, Sort[] sorts, int @from, int count)
        {
            CqlQuery<T> query = table;
            if (filters.Any())
                query = query.Where(BuildPredicate(filters));

            foreach (var sort in sorts)
            {
                query = sort.Direction == ObjectFilterSortOrder.Ascending
                            ? query.OrderBy(BuildSort(sort))
                            : query.OrderByDescending(BuildSort(sort));
            }

            // (p.vostretsov, 28.03.2020): В Cql нельзя сделать Skip
            var results = await query.Take(from + count).ExecuteAsync().ConfigureAwait(false);
            return results.Skip(from).Take(count).Cast<object>().ToArray();
        }

        public async Task<int?> Count(Filter[] filters, int? limit)
        {
            CqlQuery<T> query = table;
            if (filters.Any())
                query = query.Where(BuildPredicate(filters));

            if (limit.HasValue)
                query = query.Take(limit.Value);

            var count = await query.Count().ExecuteAsync().ConfigureAwait(false);
            return (int)count;
        }

        public async Task<object> Read(Filter[] filters)
        {
            var query = table.Where(BuildPredicate(filters));
            var results = await query.ExecuteAsync().ConfigureAwait(false);
            return results.SingleOrDefault();
        }

        public async Task Delete(object @object)
        {
            var ts = await timestampProvider.GetTimestamp(table.Name);
            await table.Where(BuildSameIdentitiesPredicate(@object)).Delete().SetTimestamp(ts).ExecuteAsync()
                       .ConfigureAwait(false);
        }

        public async Task<object> Write(object @object)
        {
            var ts = await timestampProvider.GetTimestamp(table.Name);
            await table.Insert((T)@object).SetTimestamp(ts).ExecuteAsync().ConfigureAwait(false);
            return (await table.Where(BuildSameIdentitiesPredicate(@object)).ExecuteAsync().ConfigureAwait(false))
                .SingleOrDefault();
        }

        private Expression<Func<T, object>> BuildSort(Sort sort)
        {
            return (Expression<Func<T, object>>)CriterionHelper.BuildSortExpression(typeof(T), sort.Field);
        }

        private Expression<Func<T, bool>> BuildPredicate(Filter[] filters)
        {
            return (Expression<Func<T, bool>>)CriterionHelper.BuildPredicate(typeof(T), filters);
        }

        private Expression<Func<T, bool>> BuildSameIdentitiesPredicate(object @object)
        {
            return (Expression<Func<T, bool>>)CriterionHelper.BuildSameIdentitiesPredicate(typeof(T), @object);
        }

        private readonly Table<T> table;
        private readonly ITimestampProvider timestampProvider;
    }
}