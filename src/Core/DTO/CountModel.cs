using Newtonsoft.Json;

namespace Kontur.DBViewer.Core.DTO
{
    public class CountModel
    {
        [JsonProperty("filters")]
        public Filter[] Filters { get; set; }
        [JsonProperty("limit")]
        public int? Limit { get; set; }
    }
}