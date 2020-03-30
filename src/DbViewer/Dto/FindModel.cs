using Newtonsoft.Json;

namespace SkbKontur.DbViewer.Dto
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