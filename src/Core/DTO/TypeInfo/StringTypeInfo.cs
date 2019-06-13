using Newtonsoft.Json;

namespace Kontur.DBViewer.Core.DTO.TypeInfo
{
    public class StringTypeInfo : TypeInfo
    {
        [JsonProperty("type")]
        public override PrimitiveType Type => PrimitiveType.String;
    }
}