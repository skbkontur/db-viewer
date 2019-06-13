using Kontur.DBViewer.Core.Schemas;
using Newtonsoft.Json;

namespace Kontur.DBViewer.Core.DTO
{
    public class TypeModel
    {
        [JsonProperty("name")]
        public string Name { get; set; }
        [JsonProperty("schemaDescription")]
        public SchemaDescription SchemaDescription { get; set; }
        [JsonProperty("shape")]
        public TypeInfo.TypeInfo Shape { get; set; }
    }
}