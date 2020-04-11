using Newtonsoft.Json;

namespace SkbKontur.DbViewer.VNext.DataTypes
{
    public class TypeMetaInformation
    {
        [NotNull]
        [JsonProperty("typeName")]
        public string TypeName { get; set; }

        [JsonProperty("isArray")]
        public bool IsArray { get; set; }

        [JsonProperty("isNullable")]
        public bool IsNullable { get; set; }

        [NotNull, ItemNotNull]
        [JsonProperty("properties")]
        public PropertyMetaInformation[] Properties { get; set; }

        [NotNull, ItemNotNull]
        [JsonProperty("genericTypeArguments")]
        public TypeMetaInformation[] GenericTypeArguments { get; set; }
    }
}