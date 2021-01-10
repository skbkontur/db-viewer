using Newtonsoft.Json;

namespace SkbKontur.DbViewer.DataTypes
{
    public class DownloadResult
    {
        [JsonProperty("fileQuery")]
        public string? FileQuery { get; set; }

        [JsonProperty("count")]
        public int? Count { get; set; }

        [JsonProperty("countLimit")]
        public int CountLimit { get; set; }
    }
}