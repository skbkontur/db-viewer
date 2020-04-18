using Newtonsoft.Json;

namespace SkbKontur.DbViewer.DataTypes
{
    public class DownloadResult
    {
        [JsonProperty("file")]
        public FileInfo? File { get; set; }

        [JsonProperty("count")]
        public int Count { get; set; }

        [JsonProperty("countLimit")]
        public int CountLimit { get; set; }
    }
}