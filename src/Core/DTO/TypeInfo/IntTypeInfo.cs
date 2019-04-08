using Newtonsoft.Json;

namespace Kontur.DBViewer.Core.DTO.TypeInfo
{
    public class IntTypeInfo : TypeInfo
    {
        public IntTypeInfo(bool canBeNull)
        {
            CanBeNull = canBeNull;
        }

        [JsonProperty("canBeNull")]
        public bool CanBeNull { get; }
        [JsonProperty("type")]
        public override PrimitiveType Type => PrimitiveType.Int;
    }
}