using Newtonsoft.Json;

namespace Kontur.DBViewer.Core.VNext.DataTypes
{
    public class Condition
    {
        [JsonProperty("path")]
        public string Path { get; set; }
        
        [JsonProperty("value")]
        public string Value { get; set; }
        
        [JsonProperty("operator")]
        public ObjectFieldFilterOperator Operator { get; set; }
    }
}