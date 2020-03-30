using Newtonsoft.Json;

namespace SkbKontur.DbViewer.Dto.TypeInfo
{
    public class EnumerableTypeInfo : TypeInfo
    {
        public EnumerableTypeInfo(TypeInfo underlyingType)
        {
            UnderlyingType = underlyingType;
        }

        [JsonProperty("type")]
        public override PrimitiveType Type => PrimitiveType.Enumerable;

        [JsonProperty("underlyingType")]
        public TypeInfo UnderlyingType { get; }
    }
}