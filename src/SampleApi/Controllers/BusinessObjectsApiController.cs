using System;
using System.Web.Http;
using Kontur.DBViewer.Core.VNext;
using Kontur.DBViewer.Core.VNext.DataTypes;

namespace Kontur.DBViewer.SampleApi.Controllers
{
    [RoutePrefix("business-objects")]
    public class BusinessObjectsApiController : ApiController
    {
        public BusinessObjectsApiController()
        {
            var schemaRegistry = SchemaRegistryProvider.GetSchemaRegistry();
            impl = new BusinessObjectsApi(schemaRegistry);
        }

        [HttpGet]
        [Route("names")]
        public BusinessObjectDescription[] GetBusinessObjectNames()
        {
            return impl.GetBusinessObjectNames();
        }

        [HttpPost]
        [Route("{businessObjectIdentifier}/search")]
        public SearchResult<object> FindBusinessObjects(string businessObjectIdentifier,
            [FromBody] BusinessObjectSearchRequest query, /* [FromBody] */ int offset = 0, /* [FromBody] */ int count = 20)
        {
            return impl.FindBusinessObjects(businessObjectIdentifier, query, offset, count);
        }

        [HttpPost]
        [Route("{businessObjectIdentifier}/count")]
        public SearchResult<object> GetBusinessObjectsCount(string businessObjectIdentifier,
            [FromBody] BusinessObjectSearchRequest query)
        {
            return impl.GetBusinessObjectsCount(businessObjectIdentifier, query);
        }

        [HttpPost]
        [Route("{businessObjectIdentifier}/download")]
        public Guid StartDownloadBusinessObjects(string businessObjectIdentifier,
            [FromBody] BusinessObjectSearchRequest query, /* [FromBody] */ string[] excludedFields)
        {
            return impl.StartDownloadBusinessObjects(businessObjectIdentifier, query, excludedFields);
        }

        [HttpGet]
        [Route("{businessObjectIdentifier}/download/status/{exportationId}")]
        public bool GetBusinessObjectsDownloadStatus(string businessObjectIdentifier, Guid exportationId)
        {
            return impl.GetBusinessObjectsDownloadStatus(businessObjectIdentifier, exportationId);
        }

        [HttpGet]
        [Route("{businessObjectIdentifier}/download/{exportationId}")]
        public FileResponse DownloadBusinessObjects(string businessObjectIdentifier, Guid exportationId)
        {
            return impl.DownloadBusinessObjects(businessObjectIdentifier, exportationId);
        }

        [HttpPost]
        [Route("{businessObjectIdentifier}/details")]
        public object GetBusinessObjects(string businessObjectIdentifier, [FromBody] BusinessObjectSearchRequest query)
        {
            return impl.GetBusinessObjects(businessObjectIdentifier, query);
        }

        [HttpDelete]
        [Route("{businessObjectIdentifier}/{scopeId}/{id}")]
        public void DeleteBusinessObjects(string businessObjectIdentifier, string scopeId, string id)
        {
            impl.DeleteBusinessObjects(businessObjectIdentifier, scopeId, id);
        }

        [HttpPost]
        [Route("{businessObjectIdentifier}/{scopeId}/{id}")]
        public void UpdateBusinessObjects(string businessObjectIdentifier, string scopeId, string id,
            [FromBody] UpdateBusinessObjectInfo updateInfo)
        {
            impl.UpdateBusinessObjects(businessObjectIdentifier, scopeId, id, updateInfo);
        }

        [HttpGet]
        [Route("{businessObjectIdentifier}/meta")]
        public BusinessObjectDescription GetBusinessObjectMeta(string businessObjectIdentifier)
        {
            return impl.GetBusinessObjectMeta(businessObjectIdentifier);
        }

        private readonly BusinessObjectsApi impl;
    }
}