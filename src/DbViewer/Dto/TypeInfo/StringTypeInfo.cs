using Newtonsoft.Json;

namespace SkbKontur.DbViewer.Dto.TypeInfo
{
    public class StringTypeInfo : TypeInfo
    {
        [JsonProperty("type")]
        public override PrimitiveType Type => PrimitiveType.String;
    }
}