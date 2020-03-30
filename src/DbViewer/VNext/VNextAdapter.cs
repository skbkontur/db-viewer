using System.Linq;

using SkbKontur.DbViewer.Dto;
using SkbKontur.DbViewer.VNext.DataTypes;

using Sort = SkbKontur.DbViewer.Dto.Sort;

namespace SkbKontur.DbViewer.VNext
{
    public static class VNextAdapter
    {
        public static Filter[] GetFilters(this ObjectSearchRequest query)
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

        public static Sort[] GetSorts(this ObjectSearchRequest query)
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