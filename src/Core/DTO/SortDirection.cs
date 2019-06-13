using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Kontur.DBViewer.Core.DTO
{
    [JsonConverter(typeof(StringEnumConverter))]
    public enum SortDirection
    {
        Ascending,
        Descending,
    }
}