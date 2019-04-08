using Newtonsoft.Json;

namespace Kontur.DBViewer.Core.DTO.TypeInfo
{
    public class DecimalTypeInfo : TypeInfo
    {
        public DecimalTypeInfo(bool canBeNull)
        {
            CanBeNull = canBeNull;
        }

        [JsonProperty("canBeNull")]
        public bool CanBeNull { get; }
        [JsonProperty("type")]
        public override PrimitiveType Type => PrimitiveType.Decimal;
    }
}