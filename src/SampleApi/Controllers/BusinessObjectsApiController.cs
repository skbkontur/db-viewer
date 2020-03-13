using System;
using System.Collections.Generic;
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
            [FromBody] BusinessObjectSearchRequest query, /* [FromBody] */ int offset = 0, /* [FromBody] */
            int count = 20)
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
        public FileResponse DownloadBusinessObjects(string businessObjectIdentifier,
            [FromBody] BusinessObjectSearchRequest query)
        {
            return impl.DownloadBusinessObjects(businessObjectIdentifier, query);
        }

        [HttpPost]
        [Route("{businessObjectIdentifier}/details")]
        public object GetBusinessObjects(string businessObjectIdentifier, [FromBody] BusinessObjectSearchRequest query)
        {
            return impl.GetBusinessObjects(businessObjectIdentifier, query);
        }

        [HttpDelete]
        [Route("{businessObjectIdentifier}/delete")]
        public void DeleteBusinessObjects(string businessObjectIdentifier, [FromBody] object obj)
        {
            impl.DeleteBusinessObjects(businessObjectIdentifier, obj);
        }

        [HttpPost]
        [Route("{businessObjectIdentifier}/update")]
        public void UpdateBusinessObjects(string businessObjectIdentifier, [FromBody] object obj)
        {
            impl.UpdateBusinessObjects(businessObjectIdentifier, obj);
        }

        [HttpGet]
        [Route("{businessObjectIdentifier}/meta")]
        public BusinessObjectDescription GetBusinessObjectMeta(string businessObjectIdentifier)
        {
            return impl.GetBusinessObjectMeta(businessObjectIdentifier);
        }

        private readonly BusinessObjectsApi impl;
        private readonly Dictionary<Guid, byte[]> storage = new Dictionary<Guid, byte[]>();
    }
}