using Kontur.DBViewer.Core.VNext.DataTypes;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Kontur.DBViewer.Core.DTO
{
    public class Filter
    {
        [JsonProperty("field")]
        public string Field { get; set; }
        
        [JsonConverter(typeof(StringEnumConverter))]
        [JsonProperty("type")]
        public ObjectFieldFilterOperator Type { get; set; }
        
        [JsonProperty("value")]
        public string Value { get; set; }
    }
}