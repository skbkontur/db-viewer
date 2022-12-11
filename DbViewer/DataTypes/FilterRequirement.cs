using Newtonsoft.Json;

namespace SkbKontur.DbViewer.DataTypes
{
    public class FilterRequirement
    {
        [JsonProperty("availableFilters")]
        public ObjectFieldFilterOperator[] AvailableFilters { get; set; }

        [JsonProperty("propertyName")]
        public string PropertyName { get; set; }
    }
}