using Newtonsoft.Json;

using SkbKontur.DbViewer.VNext.DataTypes;

namespace SkbKontur.DbViewer.Dto.TypeInfo
{
    public class PropertyDescription
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
    }
}