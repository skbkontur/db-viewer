using Newtonsoft.Json;

namespace SkbKontur.DbViewer.DataTypes
{
    public class SortRequirements
    {
        [JsonProperty("requiredFilters")]
        public FilterRequirement[] RequiredFilters { get; set; }

        [JsonProperty("oneDirectionSort")]
        public bool OneDirectionSort { get; set; }
        
        [JsonProperty("requiredSorts")]
        public string[] RequiredSorts { get; set; }
    }
}