using Newtonsoft.Json;

namespace SkbKontur.DbViewer.Dto.TypeInfo
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