using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Kontur.DBViewer.Core.VNext.DataTypes
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