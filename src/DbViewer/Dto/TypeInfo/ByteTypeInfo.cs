using Newtonsoft.Json;

namespace SkbKontur.DbViewer.Dto.TypeInfo
{
    public class ByteTypeInfo : TypeInfo
    {
        public ByteTypeInfo(bool canBeNull)
        {
            CanBeNull = canBeNull;
        }

        [JsonProperty("canBeNull")]
        public bool CanBeNull { get; }

        [JsonProperty("type")]
        public override PrimitiveType Type => PrimitiveType.Byte;
    }
}