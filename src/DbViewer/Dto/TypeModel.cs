using Newtonsoft.Json;

using SkbKontur.DbViewer.Schemas;

namespace SkbKontur.DbViewer.Dto
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