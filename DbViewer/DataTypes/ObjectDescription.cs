using Newtonsoft.Json;

namespace SkbKontur.DbViewer.DataTypes
{
    public class ObjectDescription : ObjectIdentifier
    {
        [JsonProperty("typeMetaInformation")]
        public TypeMetaInformation TypeMetaInformation { get; set; }
    }
}