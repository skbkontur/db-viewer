using Kontur.DBViewer.Core.Schemas;
using Newtonsoft.Json;

namespace Kontur.DBViewer.Core.VNext.DataTypes
{
    public class BusinessObjectDescription
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