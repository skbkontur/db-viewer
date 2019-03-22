using Kontur.DBViewer.Core.Connector;

namespace Kontur.DBViewer.Core.DTO
{
    public class FindModel
    {
        public Filter[] Filters { get; set; }
        public Sort[] Sorts { get; set; }
        public int From { get; set; }
        public int Count { get; set; }
    }
}