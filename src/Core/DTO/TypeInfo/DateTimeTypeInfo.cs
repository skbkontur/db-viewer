using Newtonsoft.Json;

namespace Kontur.DBViewer.Core.DTO.TypeInfo
{
    public class DateTimeTypeInfo : TypeInfo
    {
        public DateTimeTypeInfo(bool canBeNull)
        {
            CanBeNull = canBeNull;
        }

        [JsonProperty("canBeNull")]
        public bool CanBeNull { get; }
        [JsonProperty("type")]
        public override PrimitiveType Type => PrimitiveType.DateTime;
    }
}