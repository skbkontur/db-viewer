using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Kontur.DBViewer.Core.DTO
{
    public class Filter
    {
        public string Field { get; set; }
        [JsonConverter(typeof(StringEnumConverter))]
        public FilterType Type { get; set; }
        public string Value { get; set; }
    }
}