using Newtonsoft.Json;

namespace Kontur.DBViewer.Core.DTO.TypeInfo
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