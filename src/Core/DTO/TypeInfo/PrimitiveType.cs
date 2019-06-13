using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Kontur.DBViewer.Core.DTO.TypeInfo
{
    [JsonConverter(typeof(StringEnumConverter))]
    public enum PrimitiveType
    {
        String,
        Byte,
        Char,
        Int,
        Long,
        Decimal,
        DateTime,
        Enum,
        Bool,
        Class,
        Enumerable,
        Dictionary,
        HashSet,
    }
}