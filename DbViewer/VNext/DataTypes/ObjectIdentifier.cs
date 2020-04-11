using Newtonsoft.Json;

using SkbKontur.DbViewer.Schemas;

namespace SkbKontur.DbViewer.VNext.DataTypes
{
    public class ObjectIdentifier
    {
        [NotNull]
        [JsonProperty("identifier")]
        public string Identifier { get; set; }

        [NotNull]
        [JsonProperty("schemaDescription")]
        public SchemaDescription SchemaDescription { get; set; }
    }
}