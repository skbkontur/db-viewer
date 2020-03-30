using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

using SkbKontur.DbViewer.VNext.DataTypes;

namespace SkbKontur.DbViewer.Dto
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