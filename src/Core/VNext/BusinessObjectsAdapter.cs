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
                    Type = x.Operator,
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
                        Direction = query.Sort.SortOrder,
                        Field = query.Sort.Path,
                    }
                };
        }
    }
}