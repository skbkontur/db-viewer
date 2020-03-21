﻿using Newtonsoft.Json;

 namespace Kontur.DBViewer.Core.VNext.DataTypes
{
    public class FileInfo
    {
        [NotNull]
        [JsonProperty("name")]
        public string Name { get; set; }

        [NotNull]
        [JsonProperty("contentType")]
        public string ContentType { get; set; }

        [NotNull]
        [JsonProperty("content")]
        public byte[] Content { get; set; }
    }
}