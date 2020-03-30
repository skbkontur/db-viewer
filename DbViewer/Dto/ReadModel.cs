using Newtonsoft.Json;

namespace SkbKontur.DbViewer.Dto
{
    public class ReadModel
    {
        [JsonProperty("filters")]
        public Filter[] Filters { get; set; }
    }
}