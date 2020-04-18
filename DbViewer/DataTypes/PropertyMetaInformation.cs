using Newtonsoft.Json;

namespace SkbKontur.DbViewer.DataTypes
{
    public class PropertyMetaInformation
    {
        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("isIdentity")]
        public bool IsIdentity { get; set; }

        [JsonProperty("isSearchable")]
        public bool IsSearchable { get; set; }

        [JsonProperty("isSortable")]
        public bool IsSortable { get; set; }

        [JsonProperty("isRequired")]
        public bool IsRequired { get; set; }

        [JsonProperty("availableFilters")]
        public ObjectFieldFilterOperator[] AvailableFilters { get; set; }

        [JsonProperty("availableValues")]
        public string[] AvailableValues { get; set; }

        [JsonProperty("type")]
        public TypeMetaInformation Type { get; set; }
    }
}