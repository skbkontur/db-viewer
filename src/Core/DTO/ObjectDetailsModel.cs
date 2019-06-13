using Newtonsoft.Json;

namespace Kontur.DBViewer.Core.DTO
{
    public class ObjectDetailsModel
    {
        [JsonProperty("object")]
        public object Object { get; set; }
        [JsonProperty("typeInfo")]
        public TypeInfo.TypeInfo TypeInfo { get; set; }
    }
}