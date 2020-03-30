using Newtonsoft.Json;

namespace SkbKontur.DbViewer.Dto.TypeInfo
{
    public class ClassTypeInfo : TypeInfo
    {
        [JsonProperty("type")]
        public override PrimitiveType Type => PrimitiveType.Class;

        [JsonProperty("properties")]
        public Property[] Properties { get; set; }
    }
}