using Newtonsoft.Json;

namespace SkbKontur.DbViewer.Dto
{
    public class ObjectDetailsModel
    {
        [JsonProperty("object")]
        public object Object { get; set; }

        [JsonProperty("typeInfo")]
        public TypeInfo.TypeInfo TypeInfo { get; set; }
    }
}