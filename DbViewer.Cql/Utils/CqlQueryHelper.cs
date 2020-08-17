using System;
using System.Linq;
using System.Threading.Tasks;

using Cassandra.Data.Linq;

using SkbKontur.DbViewer.DataTypes;
using SkbKontur.DbViewer.Helpers;

namespace SkbKontur.DbViewer.Cql.Utils
{
    public static class CqlQueryHelper
    {
        public static async Task<object?> Read<T>(Table<T> table, Condition[] filters)
        {
            var query = BuildReadQuery(table, filters);
            var results = await query.ExecuteAsync().ConfigureAwait(false);
            return results.SingleOrDefault();
        }

        public static async Task Delete<T>(Table<T> table, ITimestampProvider timestampProvider, Condition[] filters)
        {
            var query = BuildReadQuery(table, filters);
            var results = (await query.ExecuteAsync().ConfigureAwait(false)).ToArray();
            if (results.Length != 1)
                throw new InvalidOperationException($"Expected results count to be 1 but was {results.Length}");

            var timestamp = await timestampProvider.GetTimestamp(table.Name).ConfigureAwait(false);
            await query.Delete().SetTimestamp(timestamp).ExecuteAsync().ConfigureAwait(false);
        }

        public static async Task Write<T>(Table<T> table, ITimestampProvider timestampProvider, object @object)
        {
            var timestamp = await timestampProvider.GetTimestamp(table.Name).ConfigureAwait(false);
            await table.Insert((T)@object).SetTimestamp(timestamp).ExecuteAsync().ConfigureAwait(false);
        }

        private static CqlQuery<T> BuildReadQuery<T>(CqlQuery<T> query, Condition[] filters)
        {
            if (!filters.Any() || filters.Any(x => x.Operator != ObjectFieldFilterOperator.Equals))
                throw new InvalidOperationException("Invalid filters for read query");
            return BuildQuery(query, filters);
        }

        public static CqlQuery<T> BuildQuery<T>(CqlQuery<T> query, Condition[] filters)
        {
            return filters.Any() ? query.Where(CriterionHelper.BuildPredicate<T>(filters, CqlObjectParser.Parse)) : query;
        }

        public static CqlQuery<T> BuildQuery<T>(CqlQuery<T> query, Condition[] filters, Sort[] sorts)
        {
            query = BuildQuery(query, filters);

            foreach (var sort in sorts)
                query = AddSort(query, sort);

            return query;
        }

        private static CqlQuery<T> AddSort<T>(CqlQuery<T> query, Sort sort)
        {
            var propertyType = typeof(T).GetProperty(sort.Path).PropertyType;
            return GenericMethod.Invoke(() => AddSort<T, object>(query, sort),
                                        new[] {typeof(T), typeof(object)},
                                        new[] {typeof(T), propertyType});
        }

        private static CqlQuery<T> AddSort<T, TProperty>(CqlQuery<T> query, Sort sort)
        {
            return sort.SortOrder == ObjectFilterSortOrder.Ascending
                       ? query.OrderBy(CriterionHelper.BuildSort<T, TProperty>(sort))
                       : query.OrderByDescending(CriterionHelper.BuildSort<T, TProperty>(sort));
        }
    }
}