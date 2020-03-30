using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

using SkbKontur.DbViewer.VNext.DataTypes;

namespace SkbKontur.DbViewer.Dto
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