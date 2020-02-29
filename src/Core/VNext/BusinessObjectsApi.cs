using System;
using System.Linq;
using Kontur.DBViewer.Core.Attributes;
using Kontur.DBViewer.Core.Schemas;
using Kontur.DBViewer.Core.VNext.DataTypes;
using Kontur.DBViewer.Core.VNext.Helpers;

namespace Kontur.DBViewer.Core.VNext
{
    public class BusinessObjectsApi
    {
        public BusinessObjectsApi(ISchemaRegistry schemaRegistry)
        {
            this.schemaRegistry = schemaRegistry;
        }

        [HttpGet]
        [Route("names")]
        [NotNull, ItemNotNull]
        public BusinessObjectDescription[] GetBusinessObjectNames()
        {
            return schemaRegistry.GetAllSchemas().SelectMany(x => x.Types)
                .Select(x => new BusinessObjectDescription
                {
                    Identifier = x.Type.Name,
                    StorageType = BusinessObjectStorageType.SingleObjectPerRow
                })
                .ToArray();
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
            // return schemaRegistry.GetConnector(businessObjectIdentifier)
                // .Search(filter.Filters, filter.Sorts, offset, count).GetAwaiter().GetResult();
        }

        [NotNull]
        [HttpPost]
        [Route("{businessObjectIdentifier}/count")]
        public SearchResult<object> GetBusinessObjectsCount(
            [NotNull] string businessObjectIdentifier,
            [NotNull] [FromBody] BusinessObjectSearchRequest query)
        {
            throw new NotImplementedException();
            // return schemaRegistry.GetConnector(typeIdentifier).Count(model.Filters, 10000)
                // .GetAwaiter().GetResult();
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
            var schema = schemaRegistry.GetSchemaByTypeIdentifier(businessObjectIdentifier);
            return new BusinessObjectDescription
            {
                Identifier = businessObjectIdentifier,
                StorageType = BusinessObjectStorageType.SingleObjectPerRow,
                MySqlTableName = "kek",
                TypeMetaInformation =
                    PropertyHelpers.BuildTypeMetaInformation(schema.Types
                        .Single(x => x.Type.Name == businessObjectIdentifier).Type),
            };
        }


        private readonly ISchemaRegistry schemaRegistry;
    }
}