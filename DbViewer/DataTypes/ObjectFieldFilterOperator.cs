using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace SkbKontur.DbViewer.DataTypes
{
    [JsonConverter(typeof(StringEnumConverter))]
    public enum ObjectFieldFilterOperator
    {
        Equals,
        LessThan,
        GreaterThan,
        LessThanOrEquals,
        GreaterThanOrEquals,
        DoesNotEqual
    }
}