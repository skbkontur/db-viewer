using Newtonsoft.Json;

using SkbKontur.DbViewer.Helpers;

namespace SkbKontur.DbViewer.DataTypes
{
    public class SearchResult
    {
        [JsonProperty("items")]
        [JsonConverter(typeof(ObjectJsonSerializer))]
        public object[] Items { get; set; }

        [JsonProperty("count")]
        public int Count { get; set; }

        [JsonProperty("countLimit")]
        public int CountLimit { get; set; }
    }
}