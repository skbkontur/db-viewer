using Newtonsoft.Json;

namespace Kontur.DBViewer.Core.DTO
{
    public class ReadModel
    {
        [JsonProperty("filters")]
        public Filter[] Filters { get; set; }
    }
}