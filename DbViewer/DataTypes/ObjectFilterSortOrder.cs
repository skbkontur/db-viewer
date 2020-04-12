using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace SkbKontur.DbViewer.DataTypes
{
    [JsonConverter(typeof(StringEnumConverter))]
    public enum ObjectFilterSortOrder
    {
        Ascending,
        Descending,
    }
}