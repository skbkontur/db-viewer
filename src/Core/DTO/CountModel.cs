using Kontur.DBViewer.Core.Connector;

namespace Kontur.DBViewer.Core.DTO
{
    public class CountModel
    {
        public Filter[] Filters { get; set; }
        public int? Limit { get; set; }
    }
}