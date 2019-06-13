using Newtonsoft.Json;

namespace Kontur.DBViewer.Core.DTO
{
    public class FindModel
    {
        [JsonProperty("filters")]
        public Filter[] Filters { get; set; }
        [JsonProperty("sorts")]
        public Sort[] Sorts { get; set; }
        [JsonProperty("from")]
        public int From { get; set; }
        [JsonProperty("count")]
        public int Count { get; set; }
    }
}