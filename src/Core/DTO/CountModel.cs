using Kontur.DBViewer.Core.Searcher;

namespace Kontur.DBViewer.Core.DTO
{
    public class CountModel
    {
        public Filter[] Filters { get; set; }
        public int? Limit { get; set; }
    }
}