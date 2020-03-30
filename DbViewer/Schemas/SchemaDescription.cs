using Newtonsoft.Json;

namespace SkbKontur.DbViewer.Schemas
{
    public class SchemaDescription
    {
        [JsonProperty("schemaName")]
        public string SchemaName { get; set; }

        [JsonProperty("allowReadAll")]
        public bool AllowReadAll { get; set; }

        [JsonProperty("countLimit")]
        public int CountLimit { get; set; }

        [JsonProperty("downloadLimit")]
        public int DownloadLimit { get; set; }
    }
}