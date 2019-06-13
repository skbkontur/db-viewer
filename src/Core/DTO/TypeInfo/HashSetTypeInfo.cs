using Newtonsoft.Json;

namespace Kontur.DBViewer.Core.DTO.TypeInfo
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