using System;
using System.Linq;
using Kontur.DBViewer.Core.DTO;
using Kontur.DBViewer.Core.VNext.DataTypes;
using Sort = Kontur.DBViewer.Core.DTO.Sort;

namespace Kontur.DBViewer.Core.VNext
{
    public static class BusinessObjectsAdapter
    {
        public static Filter[] GetFilters(this BusinessObjectSearchRequest query)
        {
            return query.Conditions == null
                ? new Filter[0]
                : query.Conditions.Select(x => new Filter
                {
                    Field = x.Path,
                    Type = GetFilterType(x.Operator),
                    Value = x.Value,
                }).ToArray();
        }

        public static Sort[] GetSorts(this BusinessObjectSearchRequest query)
        {
            return query.Sort == null
                ? new Sort[0]
                : new[]
                {
                    new Sort
                    {
                        Direction = GetSortDirection(query.Sort.SortOrder),
                        Field = query.Sort.Path,
                    }
                };
        }

        private static FilterType GetFilterType(BusinessObjectFieldFilterOperator op)
        {
            switch (op)
            {
                case BusinessObjectFieldFilterOperator.Equals:
                    return FilterType.Equals;
                case BusinessObjectFieldFilterOperator.GreaterThan:
                    return FilterType.Greater;
                case BusinessObjectFieldFilterOperator.LessThan:
                    return FilterType.Less;
                case BusinessObjectFieldFilterOperator.DoesNotEqual:
                    return FilterType.NotEquals;
                case BusinessObjectFieldFilterOperator.GreaterThanOrEquals:
                    return FilterType.GreaterOrEqual;
                case BusinessObjectFieldFilterOperator.LessThanOrEquals:
                    return FilterType.LessOrEqual;
                default:
                    throw new InvalidOperationException();
            }
        }

        private static SortDirection GetSortDirection(BusinessObjectFilterSortOrder order)
        {
            switch (order)
            {
                case BusinessObjectFilterSortOrder.Ascending:
                    return SortDirection.Ascending;
                case BusinessObjectFilterSortOrder.Descending:
                    return SortDirection.Descending;
                default:
                    throw new InvalidOperationException();
            }
        }
    }
}