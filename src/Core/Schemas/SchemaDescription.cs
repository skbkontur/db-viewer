using Newtonsoft.Json;

namespace Kontur.DBViewer.Core.Schemas
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