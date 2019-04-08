using Newtonsoft.Json;

namespace Kontur.DBViewer.Core.DTO.TypeInfo
{
    public class Property
    {
        [JsonProperty("typeInfo")]
        public TypeInfo TypeInfo { get; set; }
        [JsonProperty("description")]
        public PropertyDescription Description { get; set; }
    }
}