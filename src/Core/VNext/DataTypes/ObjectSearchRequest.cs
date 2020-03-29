using Newtonsoft.Json;

namespace Kontur.DBViewer.Core.VNext.DataTypes
{
    public class ObjectSearchRequest
    {
        [CanBeNull, ItemNotNull]
        [JsonProperty("conditions")]
        public Condition[] Conditions { get; set; }
        
        [CanBeNull, ItemNotNull]
        [JsonProperty("excludedFields")]
        public string[] ExcludedFields { get; set; }

        [CanBeNull]
        [JsonProperty("sort")]
        public Sort Sort { get; set; }
        
        [JsonProperty("offset")]
        public int? Offset { get; set; }

        [JsonProperty("count")]
        public int? Count { get; set; }
    }
}