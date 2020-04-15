using Newtonsoft.Json;

namespace SkbKontur.DbViewer.DataTypes
{
    public class TypeMetaInformation
    {
        public static TypeMetaInformation ForSimpleType(string name, bool isNullable = false)
        {
            return new TypeMetaInformation
                {
                    TypeName = name,
                    IsNullable = isNullable,
                    IsArray = false,
                    Properties = new PropertyMetaInformation[0],
                    GenericTypeArguments = new TypeMetaInformation[0],
                };
        }

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