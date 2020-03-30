using Kontur.DBViewer.Core.VNext.DataTypes;
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
        public ObjectFilterSortOrder Direction { get; set; }
    }
}