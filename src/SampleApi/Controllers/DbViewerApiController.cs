using System.Threading.Tasks;
using System.Web.Http;
using Kontur.DBViewer.Core.VNext;
using Kontur.DBViewer.Core.VNext.DataTypes;

namespace Kontur.DBViewer.SampleApi.Controllers
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
        public ObjectDescription[] GetNames() => impl.GetNames();

        [HttpGet]
        [Route("{objectIdentifier}/meta")]
        public ObjectDescription GetMeta(string objectIdentifier) => impl.GetMeta(objectIdentifier);

        [HttpPost]
        [Route("{objectIdentifier}/search")]
        public Task<SearchResult<object>>
            SearchObjects(string objectIdentifier, [FromBody] ObjectSearchRequest query) =>
            impl.SearchObjects(objectIdentifier, query);

        [HttpPost]
        [Route("{objectIdentifier}/download")]
        public Task<DownloadResult> DownloadObjects(string objectIdentifier,
            [FromBody] ObjectSearchRequest query) => impl.DownloadObjects(objectIdentifier, query);

        [HttpPost]
        [Route("{objectIdentifier}/details")]
        public Task<ObjectDetails> ReadObject(string objectIdentifier, [FromBody] ObjectSearchRequest query) =>
            impl.ReadObject(objectIdentifier, query);

        [HttpDelete]
        [Route("{objectIdentifier}/delete")]
        public Task DeleteObject(string objectIdentifier, [FromBody] object obj) =>
            impl.DeleteObject(objectIdentifier, obj);

        [HttpPost]
        [Route("{objectIdentifier}/update")]
        public Task<object> UpdateObject(string objectIdentifier, [FromBody] object obj) =>
            impl.UpdateObject(objectIdentifier, obj);

        private readonly DbViewerApi impl;
    }
}