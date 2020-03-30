using Newtonsoft.Json;

namespace SkbKontur.DbViewer.Dto.TypeInfo
{
    public class SByteTypeInfo : TypeInfo
    {
        public SByteTypeInfo(bool canBeNull)
        {
            CanBeNull = canBeNull;
        }

        [JsonProperty("canBeNull")]
        public bool CanBeNull { get; }

        [JsonProperty("type")]
        public override PrimitiveType Type => PrimitiveType.SByte;
    }
}