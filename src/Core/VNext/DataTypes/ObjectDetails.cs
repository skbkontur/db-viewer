using Newtonsoft.Json;

namespace Kontur.DBViewer.Core.VNext.DataTypes
{
    public class ObjectDetails
    {
        [JsonProperty("object")]
        public object Object { get; set; }
        
        [NotNull]
        [JsonProperty("meta")]
        public ObjectDescription Meta { get; set; }
    }
}