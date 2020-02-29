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
        public SearchResult<BusinessObject> FindBusinessObjects(string businessObjectIdentifier,
            [FromBody] BusinessObjectSearchRequest query, /* [FromBody] */ int offset, /* [FromBody] */ int count)
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

        [HttpGet]
        [Route("{businessObjectIdentifier}/{scopeId}/{id}")]
        public object GetBusinessObjects(string businessObjectIdentifier, string scopeId, string id)
        {
            return impl.GetBusinessObjects(businessObjectIdentifier, scopeId, id);
        }

        [HttpGet]
        [Route("{businessObjectIdentifier}/{scopeId}/{id}/{arrayIndex}")]
        public object GetBusinessArrayObject(string businessObjectIdentifier, string scopeId, string id,
            string arrayIndex)
        {
            return impl.GetBusinessArrayObject(businessObjectIdentifier, scopeId, id, arrayIndex);
        }

        [HttpDelete]
        [Route("{businessObjectIdentifier}/{scopeId}/{id}")]
        public void DeleteBusinessObjects(string businessObjectIdentifier, string scopeId, string id)
        {
            impl.DeleteBusinessObjects(businessObjectIdentifier, scopeId, id);
        }

        [HttpDelete]
        [Route("{businessObjectIdentifier}/{scopeId}/{id}/{arrayIndex}")]
        public void DeleteBusinessArrayObject(string businessObjectIdentifier, string scopeId, string id,
            string arrayIndex)
        {
            impl.DeleteBusinessArrayObject(businessObjectIdentifier, scopeId, id, arrayIndex);
        }

        [HttpPost]
        [Route("{businessObjectIdentifier}/{scopeId}/{id}")]
        public void UpdateBusinessObjects(string businessObjectIdentifier, string scopeId, string id,
            [FromBody] UpdateBusinessObjectInfo updateInfo)
        {
            impl.UpdateBusinessObjects(businessObjectIdentifier, scopeId, id, updateInfo);
        }

        [HttpPost]
        [Route("{businessObjectIdentifier}/{scopeId}/{id}/{arrayIndex}")]
        public void UpdateBusinessArrayObject(string businessObjectIdentifier, string scopeId,
            string id, string arrayIndex, [FromBody] UpdateBusinessObjectInfo updateInfo)
        {
            impl.UpdateBusinessArrayObject(businessObjectIdentifier, scopeId, id, arrayIndex, updateInfo);
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