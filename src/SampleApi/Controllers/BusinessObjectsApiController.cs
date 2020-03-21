using System;
using System.Collections.Generic;
using System.Threading.Tasks;
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

        [HttpGet]
        [Route("{businessObjectIdentifier}/meta")]
        public BusinessObjectDescription GetBusinessObjectMeta(string businessObjectIdentifier)
        {
            return impl.GetBusinessObjectMeta(businessObjectIdentifier);
        }

        [HttpPost]
        [Route("{businessObjectIdentifier}/search")]
        public Task<SearchResult<object>> FindBusinessObjects(string businessObjectIdentifier,
            [FromBody] BusinessObjectSearchRequest query)
        {
            return impl.FindBusinessObjects(businessObjectIdentifier, query);
        }

        [HttpPost]
        [Route("{businessObjectIdentifier}/download")]
        public Task<DownloadResult> DownloadBusinessObjects(string businessObjectIdentifier,
            [FromBody] BusinessObjectSearchRequest query)
        {
            return impl.DownloadBusinessObjects(businessObjectIdentifier, query);
        }

        [HttpPost]
        [Route("{businessObjectIdentifier}/details")]
        public Task<BusinessObjectDetails> GetBusinessObjects(string businessObjectIdentifier, [FromBody] BusinessObjectSearchRequest query)
        {
            return impl.GetBusinessObjects(businessObjectIdentifier, query);
        }

        [HttpDelete]
        [Route("{businessObjectIdentifier}/delete")]
        public Task DeleteBusinessObjects(string businessObjectIdentifier, [FromBody] object obj)
        {
            return impl.DeleteBusinessObjects(businessObjectIdentifier, obj);
        }

        [HttpPost]
        [Route("{businessObjectIdentifier}/update")]
        public Task<object> UpdateBusinessObjects(string businessObjectIdentifier, [FromBody] object obj)
        {
            return impl.UpdateBusinessObjects(businessObjectIdentifier, obj);
        }

        private readonly BusinessObjectsApi impl;
    }
}