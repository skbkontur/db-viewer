using Newtonsoft.Json;

namespace SkbKontur.DbViewer.Dto
{
    public class CountModel
    {
        [JsonProperty("filters")]
        public Filter[] Filters { get; set; }

        [JsonProperty("limit")]
        public int? Limit { get; set; }
    }
}