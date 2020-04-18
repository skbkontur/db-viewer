using Newtonsoft.Json;

namespace SkbKontur.DbViewer.DataTypes
{
    public class ObjectSearchRequest
    {
        [JsonProperty("conditions")]
        public Condition[] Conditions { get; set; }

        [JsonProperty("excludedFields")]
        public string[] ExcludedFields { get; set; }

        [JsonProperty("sorts")]
        public Sort[] Sorts { get; set; }

        [JsonProperty("offset")]
        public int? Offset { get; set; }

        [JsonProperty("count")]
        public int? Count { get; set; }
    }
}