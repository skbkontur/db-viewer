using System;

using Newtonsoft.Json;

namespace SkbKontur.DbViewer.DataTypes
{
    public class DownloadResult
    {
        [JsonProperty("requestId")]
        public Guid? RequestId { get; set; }

        [JsonProperty("count")]
        public int? Count { get; set; }

        [JsonProperty("countLimit")]
        public int CountLimit { get; set; }
    }
}