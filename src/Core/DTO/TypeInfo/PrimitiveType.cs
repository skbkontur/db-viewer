using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Kontur.DBViewer.Core.DTO.TypeInfo
{
    [JsonConverter(typeof(StringEnumConverter))]
    public enum PrimitiveType
    {
        String,
        Byte,
        SByte,
        Char,
        Int,
        Long,
        Short,
        Decimal,
        Date,
        Time,
        DateTime,
        Enum,
        Bool,
        Class,
        ByteArray,
        Enumerable,
        Dictionary,
        HashSet,
    }
}