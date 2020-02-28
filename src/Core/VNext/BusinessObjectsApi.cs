using System;
using Kontur.DBViewer.Core.Attributes;
using Kontur.DBViewer.Core.VNext.DataTypes;

namespace Kontur.DBViewer.Core.VNext
{
    public class BusinessObjectsApi
    {
        [HttpGet]
        [Route("names")]
        [NotNull, ItemNotNull]
        public BusinessObjectDescription[] GetBusinessObjectNames()
        {
            throw new NotImplementedException();
        }

        [NotNull]
        [HttpPost]
        [Route("{businessObjectIdentifier}/search")]
        public SearchResult<BusinessObject> FindBusinessObjects(
            [NotNull] string businessObjectIdentifier,
            [NotNull] [FromBody] BusinessObjectSearchRequest query,
            /* [FromBody] */ int offset,
            /* [FromBody] */ int count)
        {
            throw new NotImplementedException();
        }

        [NotNull]
        [HttpPost]
        [Route("{businessObjectIdentifier}/count")]
        public SearchResult<object> GetBusinessObjectsCount(
            [NotNull] string businessObjectIdentifier,
            [NotNull] [FromBody] BusinessObjectSearchRequest query)
        {
            throw new NotImplementedException();
        }

        [HttpPost]
        [Route("{businessObjectIdentifier}/download")]
        public Guid StartDownloadBusinessObjects(
            [NotNull] string businessObjectIdentifier,
            [NotNull] [FromBody] BusinessObjectSearchRequest query,
            [NotNull, ItemNotNull] /* [FromBody] */ string[] excludedFields)
        {
            throw new NotImplementedException();
        }

        [HttpGet]
        [Route("{businessObjectIdentifier}/download/status/{exportationId}")]
        public bool GetBusinessObjectsDownloadStatus([NotNull] string businessObjectIdentifier, Guid exportationId)
        {
            throw new NotImplementedException();
        }

        [NotNull]
        [HttpGet]
        [Route("{businessObjectIdentifier}/download/{exportationId}")]
        public FileResponse DownloadBusinessObjects([NotNull] string businessObjectIdentifier, Guid exportationId)
        {
            throw new NotImplementedException();
        }

        [NotNull]
        [HttpGet]
        [Route("{businessObjectIdentifier}/{scopeId}/{id}")]
        public object GetBusinessObjects([NotNull] string businessObjectIdentifier, [NotNull] string scopeId,
            [NotNull] string id)
        {
            throw new NotImplementedException();
        }

        [NotNull]
        [HttpGet]
        [Route("{businessObjectIdentifier}/{scopeId}/{id}/{arrayIndex}")]
        public object GetBusinessArrayObject([NotNull] string businessObjectIdentifier, [NotNull] string scopeId,
            [NotNull] string id, [NotNull] string arrayIndex)
        {
            throw new NotImplementedException();
        }

        [HttpDelete]
        [Route("{businessObjectIdentifier}/{scopeId}/{id}")]
        public void DeleteBusinessObjects([NotNull] string businessObjectIdentifier, [NotNull] string scopeId,
            [NotNull] string id)
        {
            throw new NotImplementedException();
        }

        [HttpDelete]
        [Route("{businessObjectIdentifier}/{scopeId}/{id}/{arrayIndex}")]
        public void DeleteBusinessArrayObject([NotNull] string businessObjectIdentifier, [NotNull] string scopeId,
            [NotNull] string id, [NotNull] string arrayIndex)
        {
            throw new NotImplementedException();
        }

        [HttpPost]
        [Route("{businessObjectIdentifier}/{scopeId}/{id}")]
        public void UpdateBusinessObjects([NotNull] string businessObjectIdentifier, [NotNull] string scopeId,
            [NotNull] string id, [NotNull] [FromBody] UpdateBusinessObjectInfo updateInfo)
        {
            throw new NotImplementedException();
        }

        [HttpPost]
        [Route("{businessObjectIdentifier}/{scopeId}/{id}/{arrayIndex}")]
        public void UpdateBusinessArrayObject([NotNull] string businessObjectIdentifier, [NotNull] string scopeId,
            [NotNull] string id, [NotNull] string arrayIndex, [NotNull] [FromBody] UpdateBusinessObjectInfo updateInfo)
        {
            throw new NotImplementedException();
        }

        [NotNull]
        [HttpGet]
        [Route("{businessObjectIdentifier}/meta")]
        public BusinessObjectDescription GetBusinessObjectMeta([NotNull] string businessObjectIdentifier)
        {
            throw new NotImplementedException();
        }
    }
}