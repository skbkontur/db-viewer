using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace SkbKontur.DbViewer.Dto.TypeInfo
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