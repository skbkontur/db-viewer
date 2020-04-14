using System;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

using Cassandra.Data.Linq;

using SkbKontur.DbViewer.Connector;
using SkbKontur.DbViewer.Cql.Utils;
using SkbKontur.DbViewer.DataTypes;
using SkbKontur.DbViewer.Helpers;

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
            CqlQuery<T> query = table;
            if (filters.Any())
                query = query.Where(BuildPredicate(filters));

            foreach (var sort in sorts)
            {
                var propertyType = typeof(T).GetProperty(sort.Path).PropertyType;
                query = GenericMethod.Invoke(() => AddSort<object>(query, sort), typeof(object), propertyType);
            }

            // (p.vostretsov, 28.03.2020): В Cql нельзя сделать Skip
            var results = await query.Take(from + count).ExecuteAsync().ConfigureAwait(false);
            return results.Skip(from).Take(count).Cast<object>().ToArray();
        }

        public async Task<int?> Count(Condition[] filters, int? limit)
        {
            CqlQuery<T> query = table;
            if (filters.Any())
                query = query.Where(BuildPredicate(filters));

            if (limit.HasValue)
                query = query.Take(limit.Value);

            var count = await query.Count().ExecuteAsync().ConfigureAwait(false);
            return (int)count;
        }

        public async Task<object> Read(Condition[] filters)
        {
            var query = table.Where(BuildPredicate(filters));
            var results = await query.ExecuteAsync().ConfigureAwait(false);
            return results.SingleOrDefault();
        }

        public async Task Delete(Condition[] filters)
        {
            var predicate = BuildPredicate(filters);
            var results = (await table.Where(predicate).ExecuteAsync().ConfigureAwait(false)).ToArray();
            if (results.Length != 1)
                throw new InvalidOperationException($"Expected results count to be 1 but was {results.Length}");

            var timestamp = await timestampProvider.GetTimestamp(table.Name).ConfigureAwait(false);
            await table.Where(predicate).Delete().SetTimestamp(timestamp).ExecuteAsync().ConfigureAwait(false);
        }

        public async Task<object> Write(object @object)
        {
            var timestamp = await timestampProvider.GetTimestamp(table.Name).ConfigureAwait(false);
            await table.Insert((T)@object).SetTimestamp(timestamp).ExecuteAsync().ConfigureAwait(false);
            return (await table.Where(BuildSameIdentitiesPredicate(@object)).ExecuteAsync().ConfigureAwait(false)).SingleOrDefault();
        }

        private static CqlQuery<T> AddSort<TProperty>(CqlQuery<T> query, Sort sort)
        {
            return sort.SortOrder == ObjectFilterSortOrder.Ascending
                       ? query.OrderBy(BuildSort<TProperty>(sort))
                       : query.OrderByDescending(BuildSort<TProperty>(sort));
        }

        private static Expression<Func<T, TProperty>> BuildSort<TProperty>(Sort sort)
        {
            return (Expression<Func<T, TProperty>>)CriterionHelper.BuildSortExpression(typeof(T), sort.Path);
        }

        private static Expression<Func<T, bool>> BuildPredicate(Condition[] filters)
        {
            return (Expression<Func<T, bool>>)CriterionHelper.BuildPredicate(typeof(T), filters);
        }

        private static Expression<Func<T, bool>> BuildSameIdentitiesPredicate(object @object)
        {
            return (Expression<Func<T, bool>>)CriterionHelper.BuildSameIdentitiesPredicate(typeof(T), @object);
        }

        private readonly Table<T> table;
        private readonly ITimestampProvider timestampProvider;
    }
}