using Newtonsoft.Json;

namespace SkbKontur.DbViewer.Dto.TypeInfo
{
    public class Property
    {
        [JsonProperty("typeInfo")]
        public TypeInfo TypeInfo { get; set; }

        [JsonProperty("description")]
        public PropertyDescription Description { get; set; }
    }
}