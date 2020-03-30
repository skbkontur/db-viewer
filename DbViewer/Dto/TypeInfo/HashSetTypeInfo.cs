using Newtonsoft.Json;

namespace SkbKontur.DbViewer.Dto.TypeInfo
{
    public class HashSetTypeInfo : TypeInfo
    {
        public HashSetTypeInfo(TypeInfo underlyingType)
        {
            UnderlyingType = underlyingType;
        }

        [JsonProperty("type")]
        public override PrimitiveType Type => PrimitiveType.HashSet;

        [JsonProperty("underlyingType")]
        public TypeInfo UnderlyingType { get; }
    }
}