using Newtonsoft.Json;

namespace SkbKontur.DbViewer.DataTypes
{
    public class FileInfo
    {
        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("contentType")]
        public string ContentType { get; set; }

        [JsonProperty("content")]
        public byte[] Content { get; set; }
    }
}