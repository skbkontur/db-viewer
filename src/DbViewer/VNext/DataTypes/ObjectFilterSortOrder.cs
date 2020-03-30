using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace SkbKontur.DbViewer.VNext.DataTypes
{
    [JsonConverter(typeof(StringEnumConverter))]
    public enum ObjectFilterSortOrder
    {
        Ascending,
        Descending,
    }
}