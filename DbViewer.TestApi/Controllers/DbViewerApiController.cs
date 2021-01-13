using System;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Mvc;

using SkbKontur.DbViewer.Configuration;
using SkbKontur.DbViewer.DataTypes;

namespace SkbKontur.DbViewer.TestApi.Controllers
{
    [ApiController]
    [Route("db-viewer")]
    public class DbViewerApiController : ControllerBase
    {
        public DbViewerApiController(SchemaRegistryProvider schemaRegistryProvider)
        {
            impl = new DbViewerApi(schemaRegistryProvider.GetSchemaRegistry());
        }

        [HttpGet]
        [Route("file")]
        public IActionResult GetFile()
        {
            return File(new DownloadFileStream(), "text/csv", "file.csv");
        }

        [HttpGet]
        [Route("names")]
        public ObjectIdentifier[] GetNames() => impl.GetNames();

        [HttpGet]
        [Route("{objectIdentifier}/meta")]
        public ObjectDescription GetMeta(string objectIdentifier) => impl.GetMeta(objectIdentifier);

        [HttpPost]
        [Route("{objectIdentifier}/search")]
        public Task<SearchResult> SearchObjects(string objectIdentifier, [FromBody] ObjectSearchRequest query) => impl.SearchObjects(objectIdentifier, query, true);

        [HttpPost]
        [Route("{objectIdentifier}/count")]
        public Task<DownloadResult> CountObjects(string objectIdentifier, [FromBody] ObjectSearchRequest query) => impl.CountObjects(objectIdentifier, query, true);

        [HttpGet]
        [Route("{objectIdentifier}/download/{query}")]
        public async Task<IActionResult> DownloadObjects(string objectIdentifier, Guid query)
        {
            var fileInfo = await impl.DownloadObjects(objectIdentifier, query, true).ConfigureAwait(false);
            return File(fileInfo.Content, fileInfo.ContentType, fileInfo.Name);
        }

        [HttpPost]
        [Route("{objectIdentifier}/details")]
        public Task<ObjectDetails> ReadObject(string objectIdentifier, [FromBody] ObjectReadRequest query) => impl.ReadObject(objectIdentifier, query);

        [HttpDelete]
        [Route("{objectIdentifier}/delete")]
        public Task DeleteObject(string objectIdentifier, [FromBody] ObjectReadRequest query) => impl.DeleteObject(objectIdentifier, query, true);

        [HttpPost]
        [Route("{objectIdentifier}/update")]
        public Task UpdateObject(string objectIdentifier, [FromBody] ObjectUpdateRequest query) => impl.UpdateObject(objectIdentifier, query, true);

        private readonly DbViewerApi impl;
    }
}