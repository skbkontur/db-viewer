using Newtonsoft.Json;

namespace SkbKontur.DbViewer.Dto.TypeInfo
{
    public class LongTypeInfo : TypeInfo
    {
        public LongTypeInfo(bool canBeNull)
        {
            CanBeNull = canBeNull;
        }

        [JsonProperty("canBeNull")]
        public bool CanBeNull { get; }

        [JsonProperty("type")]
        public override PrimitiveType Type => PrimitiveType.Long;
    }
}