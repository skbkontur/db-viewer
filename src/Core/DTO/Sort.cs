using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Kontur.DBViewer.Core.DTO
{
    public class Sort
    {
        [JsonProperty("field")]
        public string Field { get; set; }
        
        [JsonConverter(typeof(StringEnumConverter))]
        [JsonProperty("direction")]
        public SortDirection Direction { get; set; }
    }
}