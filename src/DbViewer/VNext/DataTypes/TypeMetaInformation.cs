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

        [CanBeNull, ItemNotNull]
        [JsonProperty("properties")]
        public PropertyMetaInformation[] Properties { get; set; }

        [CanBeNull]
        [JsonProperty("itemType")]
        public TypeMetaInformation ItemType { get; set; }

        [CanBeNull, ItemNotNull]
        [JsonProperty("genericTypeArguments")]
        public TypeMetaInformation[] GenericTypeArguments { get; set; }
    }
}