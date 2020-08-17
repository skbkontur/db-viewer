using System;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.EntityFrameworkCore;

using SkbKontur.DbViewer.Connector;
using SkbKontur.DbViewer.DataTypes;
using SkbKontur.DbViewer.Helpers;

namespace SkbKontur.DbViewer.EntityFramework
{
    public class EntityFrameworkDbConnector<T> : IDbConnector
        where T : class
    {
        public EntityFrameworkDbConnector(Func<DbContext> createContext)
        {
            this.createContext = createContext;
        }

        public async Task<object[]> Search(Condition[] filters, Sort[] sorts, int from, int count)
        {
            await using var context = createContext();

            var query = BuildQuery(context.Set<T>().AsNoTracking(), filters);
            query = AddSorts(query, sorts);
            query = query.Skip(from).Take(count);

            var results = await query.ToArrayAsync().ConfigureAwait(false);
            return results.Cast<object>().ToArray();
        }

        public async Task<int?> Count(Condition[] filters, int limit)
        {
            await using var context = createContext();

            var query = BuildQuery(context.Set<T>().AsNoTracking(), filters).Take(limit);
            var count = await query.CountAsync().ConfigureAwait(false);
            return count;
        }

        public async Task<object?> Read(Condition[] filters)
        {
            await using var context = createContext();

            var query = BuildReadQuery(context.Set<T>().AsNoTracking(), filters);
            var results = await query.ToArrayAsync().ConfigureAwait(false);
            return results.SingleOrDefault();
        }

        public async Task Delete(Condition[] filters)
        {
            await using var context = createContext();

            var query = BuildReadQuery(context.Set<T>(), filters);
            var results = await query.ToArrayAsync().ConfigureAwait(false);
            if (results.Length != 1)
                throw new InvalidOperationException($"Expected results count to be 1 but was {results.Length}");

            context.Set<T>().RemoveRange(results);
            await context.SaveChangesAsync().ConfigureAwait(false);
        }

        public async Task Write(object @object)
        {
            await using var context = createContext();

            context.Set<T>().Update((T)@object);
            await context.SaveChangesAsync().ConfigureAwait(false);
        }

        private static IQueryable<T> BuildReadQuery(IQueryable<T> query, Condition[] filters)
        {
            if (!filters.Any() || filters.Any(x => x.Operator != ObjectFieldFilterOperator.Equals))
                throw new InvalidOperationException("Invalid filters for read query");
            return BuildQuery(query, filters);
        }

        private static IQueryable<T> BuildQuery(IQueryable<T> query, Condition[] filters)
        {
            return filters.Any() ? query.Where(CriterionHelper.BuildPredicate<T>(filters)) : query;
        }

        private static IQueryable<T> AddSorts(IQueryable<T> query, Sort[] sorts)
        {
            if (sorts.Length == 0)
                return query;
            IOrderedQueryable<T> orderedQuery = AddSort(query, sorts[0]);
            for (var i = 1; i < sorts.Length; i++)
                orderedQuery = AddSort(orderedQuery, sorts[i]);
            return orderedQuery;
        }

        private static IOrderedQueryable<T> AddSort(IQueryable<T> query, Sort sort)
        {
            var propertyType = typeof(T).GetProperty(sort.Path).PropertyType;
            return GenericMethod.Invoke(() => AddSort<object>(query, sort), new[] {typeof(object)}, new[] {propertyType});
        }

        private static IOrderedQueryable<T> AddSort(IOrderedQueryable<T> query, Sort sort)
        {
            var propertyType = typeof(T).GetProperty(sort.Path).PropertyType;
            return GenericMethod.Invoke(() => AddSort<object>(query, sort), new[] {typeof(object)}, new[] {propertyType});
        }

        private static IOrderedQueryable<T> AddSort<TProperty>(IQueryable<T> query, Sort sort)
        {
            return sort.SortOrder == ObjectFilterSortOrder.Ascending
                       ? query.OrderBy(CriterionHelper.BuildSort<T, TProperty>(sort))
                       : query.OrderByDescending(CriterionHelper.BuildSort<T, TProperty>(sort));
        }

        private static IOrderedQueryable<T> AddSort<TProperty>(IOrderedQueryable<T> query, Sort sort)
        {
            return sort.SortOrder == ObjectFilterSortOrder.Ascending
                       ? query.ThenBy(CriterionHelper.BuildSort<T, TProperty>(sort))
                       : query.ThenByDescending(CriterionHelper.BuildSort<T, TProperty>(sort));
        }

        private readonly Func<DbContext> createContext;
    }
}