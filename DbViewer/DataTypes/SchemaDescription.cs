using Newtonsoft.Json;

namespace SkbKontur.DbViewer.DataTypes
{
    public class SchemaDescription
    {
        [JsonProperty("schemaName")]
        public string SchemaName { get; set; }

        [JsonProperty("allowReadAll")]
        public bool AllowReadAll { get; set; }

        [JsonProperty("allowDelete")]
        public bool AllowDelete { get; set; }

        [JsonProperty("allowEdit")]
        public bool AllowEdit { get; set; }

        [JsonProperty("allowSort")]
        public bool AllowSort { get; set; }

        [JsonProperty("countLimit")]
        public int CountLimit { get; set; }

        [JsonProperty("countLimitForSuperUser")]
        public int CountLimitForSuperUser { get; set; }

        [JsonProperty("downloadLimit")]
        public int DownloadLimit { get; set; }

        [JsonProperty("downloadLimitForSuperUser")]
        public int DownloadLimitForSuperUser { get; set; }
    }
}