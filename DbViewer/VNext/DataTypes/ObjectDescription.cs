using Newtonsoft.Json;

using SkbKontur.DbViewer.Schemas;

namespace SkbKontur.DbViewer.VNext.DataTypes
{
    public class ObjectDescription
    {
        [NotNull]
        [JsonProperty("identifier")]
        public string Identifier { get; set; }

        [NotNull]
        [JsonProperty("schemaDescription")]
        public SchemaDescription SchemaDescription { get; set; }

        [JsonProperty("typeMetaInformation")]
        public TypeMetaInformation TypeMetaInformation { get; set; }
    }
}