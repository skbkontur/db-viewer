using Newtonsoft.Json;

namespace Kontur.DBViewer.Core.VNext.DataTypes
{
    public class PropertyMetaInformation
    {
        [NotNull]
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
        
        [NotNull]
        [JsonProperty("availableFilters")]
        public BusinessObjectFieldFilterOperator[] AvailableFilters { get; set; }

        [JsonProperty("type")]
        public TypeMetaInformation Type { get; set; }
    }
}