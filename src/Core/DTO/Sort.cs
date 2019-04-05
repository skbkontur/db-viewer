using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Kontur.DBViewer.Core.DTO
{
    public class Sort
    {
        public string Field { get; set; }
        [JsonConverter(typeof(StringEnumConverter))]
        public SortDirection Direction { get; set; }
    }
}