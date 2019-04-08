using Newtonsoft.Json;

namespace Kontur.DBViewer.Core.Schemas
{
    public class SchemaDescription
    {
        [JsonProperty("schemaName")]
        public string SchemaName { get; set; }
        [JsonProperty("enableDefaultSearch")]
        public bool EnableDefaultSearch { get; set; }
        [JsonProperty("countable")]
        public bool Countable { get; set; }
        [JsonProperty("defaultCountLimit")]
        public int? DefaultCountLimit { get; set; }
        [JsonProperty("maxCountLimit")]
        public int? MaxCountLimit { get; set; }
    }
}