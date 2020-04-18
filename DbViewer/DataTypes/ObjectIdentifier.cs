using Newtonsoft.Json;

namespace SkbKontur.DbViewer.DataTypes
{
    public class ObjectIdentifier
    {
        [JsonProperty("identifier")]
        public string Identifier { get; set; }

        [JsonProperty("schemaDescription")]
        public SchemaDescription SchemaDescription { get; set; }
    }
}