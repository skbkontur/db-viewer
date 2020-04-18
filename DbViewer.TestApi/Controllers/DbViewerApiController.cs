using System.Threading.Tasks;
using System.Web.Http;

using SkbKontur.DbViewer.DataTypes;

namespace SkbKontur.DbViewer.TestApi.Controllers
{
    [RoutePrefix("db-viewer")]
    public class DbViewerApiController : ApiController
    {
        public DbViewerApiController()
        {
            var schemaRegistry = SchemaRegistryProvider.GetSchemaRegistry();
            impl = new DbViewerApi(schemaRegistry);
        }

        [HttpGet]
        [Route("names")]
        public ObjectIdentifier[] GetNames() => impl.GetNames();

        [HttpGet]
        [Route("{objectIdentifier}/meta")]
        public ObjectDescription GetMeta(string objectIdentifier) => impl.GetMeta(objectIdentifier);

        [HttpPost]
        [Route("{objectIdentifier}/search")]
        public Task<SearchResult> SearchObjects(string objectIdentifier, [FromBody] ObjectSearchRequest query) => impl.SearchObjects(objectIdentifier, query);

        [HttpPost]
        [Route("{objectIdentifier}/download")]
        public Task<DownloadResult> DownloadObjects(string objectIdentifier, [FromBody] ObjectSearchRequest query) => impl.DownloadObjects(objectIdentifier, query);

        [HttpPost]
        [Route("{objectIdentifier}/details")]
        public Task<ObjectDetails> ReadObject(string objectIdentifier, [FromBody] ObjectReadRequest query) => impl.ReadObject(objectIdentifier, query);

        [HttpDelete]
        [Route("{objectIdentifier}/delete")]
        public Task DeleteObject(string objectIdentifier, [FromBody] ObjectReadRequest query) => impl.DeleteObject(objectIdentifier, query);

        [HttpPost]
        [Route("{objectIdentifier}/update")]
        public Task UpdateObject(string objectIdentifier, [FromBody] ObjectUpdateRequest query) => impl.UpdateObject(objectIdentifier, query);

        private readonly DbViewerApi impl;
    }
}