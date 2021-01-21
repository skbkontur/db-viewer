using Newtonsoft.Json;

namespace SkbKontur.DbViewer.DataTypes
{
    public class CountResult
    {
        [JsonProperty("count")]
        public int? Count { get; set; }

        [JsonProperty("countLimit")]
        public int CountLimit { get; set; }
    }
}