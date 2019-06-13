using Newtonsoft.Json;

namespace Kontur.DBViewer.Core.DTO
{
    public class TypesListModel
    {
        [JsonProperty("types")]
        public TypeModel[] Types { get; set; }
    }
}