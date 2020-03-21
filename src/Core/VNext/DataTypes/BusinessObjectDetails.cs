using Newtonsoft.Json;

namespace Kontur.DBViewer.Core.VNext.DataTypes
{
    public class BusinessObjectDetails
    {
        [JsonProperty("object")]
        public object Object { get; set; }
        
        [NotNull]
        [JsonProperty("meta")]
        public BusinessObjectDescription Meta { get; set; }
    }
}