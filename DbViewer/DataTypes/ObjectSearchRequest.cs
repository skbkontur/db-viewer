using Newtonsoft.Json;

namespace SkbKontur.DbViewer.DataTypes
{
    public class ObjectSearchRequest
    {
        [NotNull, ItemNotNull]
        [JsonProperty("conditions")]
        public Condition[] Conditions { get; set; }

        [NotNull, ItemNotNull]
        [JsonProperty("excludedFields")]
        public string[] ExcludedFields { get; set; }

        [NotNull, ItemNotNull]
        [JsonProperty("sorts")]
        public Sort[] Sorts { get; set; }

        [JsonProperty("offset")]
        public int? Offset { get; set; }

        [JsonProperty("count")]
        public int? Count { get; set; }
    }
}