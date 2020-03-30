using Newtonsoft.Json;

namespace SkbKontur.DbViewer.Dto.TypeInfo
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