using Kontur.DBViewer.Core.VNext.DataTypes;
using Newtonsoft.Json;

namespace Kontur.DBViewer.Core.DTO.TypeInfo
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