using Newtonsoft.Json;

namespace Kontur.DBViewer.Core.DTO.TypeInfo
{
    public class EnumTypeInfo : TypeInfo
    {
        public EnumTypeInfo(bool canBeNull, string[] availableValues)
        {
            CanBeNull = canBeNull;
            AvailableValues = availableValues;
        }

        [JsonProperty("canBeNull")]
        public bool CanBeNull { get; }
        [JsonProperty("type")]
        public override PrimitiveType Type => PrimitiveType.Enum;
        [JsonProperty("availableValues")]
        public string[] AvailableValues { get; }
    }
}