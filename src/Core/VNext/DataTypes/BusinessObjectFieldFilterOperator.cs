using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Kontur.DBViewer.Core.VNext.DataTypes
{
    [JsonConverter(typeof(StringEnumConverter))]
    public enum BusinessObjectFieldFilterOperator
    {
        Equals,
        LessThan,
        GreaterThan,
        LessThanOrEquals,
        GreaterThanOrEquals,
        DoesNotEqual
    }
}