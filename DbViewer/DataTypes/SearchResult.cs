using Newtonsoft.Json;

namespace SkbKontur.DbViewer.DataTypes
{
    public class SearchResult
    {
        [JsonProperty("items")]
        public object[] Items { get; set; }

        [JsonProperty("count")]
        public int Count { get; set; }

        [JsonProperty("countLimit")]
        public int CountLimit { get; set; }
    }
}