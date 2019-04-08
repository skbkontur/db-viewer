using Newtonsoft.Json;

namespace Kontur.DBViewer.Core.DTO.TypeInfo
{
    public class ClassTypeInfo : TypeInfo
    {
        [JsonProperty("type")]
        public override PrimitiveType Type => PrimitiveType.Class;
        [JsonProperty("properties")]
        public Property[] Properties { get; set; }
    }
}