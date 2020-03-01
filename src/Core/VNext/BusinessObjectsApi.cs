using System;
using System.Linq;
using Kontur.DBViewer.Core.Attributes;
using Kontur.DBViewer.Core.DTO;
using Kontur.DBViewer.Core.DTO.TypeInfo;
using Kontur.DBViewer.Core.Schemas;
using Kontur.DBViewer.Core.TypeAndObjectBulding;
using Kontur.DBViewer.Core.VNext.DataTypes;
using Kontur.DBViewer.Core.VNext.Helpers;
using Sort = Kontur.DBViewer.Core.DTO.Sort;

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
        public SearchResult<object> FindBusinessObjects(
            [NotNull] string businessObjectIdentifier,
            [NotNull] [FromBody] BusinessObjectSearchRequest query,
            /* [FromBody] */ int offset,
            /* [FromBody] */ int count)
        {
            var results = schemaRegistry.GetConnector(businessObjectIdentifier)
                .Search(query.GetFilters(), query.GetSorts(), offset, count).GetAwaiter().GetResult();
            return new SearchResult<object>
            {
                Count = results.Length,
                CountLimit = 10000,
                Items = results,
            };
        }

        [NotNull]
        [HttpPost]
        [Route("{businessObjectIdentifier}/count")]
        public SearchResult<object> GetBusinessObjectsCount(
            [NotNull] string businessObjectIdentifier,
            [NotNull] [FromBody] BusinessObjectSearchRequest query)
        {
            var results = schemaRegistry.GetConnector(businessObjectIdentifier).Count(query.GetFilters(), 10000)
                .GetAwaiter().GetResult();
            return new SearchResult<object>
            {
                Count = results ?? 0,
                CountLimit = 10000,
                Items = new object[0],
            };
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
        [HttpPost]
        [Route("{businessObjectIdentifier}")]
        public object GetBusinessObjects([NotNull] string businessObjectIdentifier, [NotNull] [FromBody] BusinessObjectSearchRequest query)
        {
            var type = schemaRegistry.GetTypeByTypeIdentifier(businessObjectIdentifier);
            var schema = schemaRegistry.GetSchemaByTypeIdentifier(businessObjectIdentifier);
            var result = schemaRegistry.GetConnector(businessObjectIdentifier).Read(query.GetFilters()).GetAwaiter()
                .GetResult();
            var typeInfo = TypeInfoExtractor.Extract(result, type, schema.PropertyDescriptionBuilder,
                schema.CustomPropertyConfigurationProvider);
            var obj = ObjectsConverter.StoredToApi(typeInfo, type, result, schema.CustomPropertyConfigurationProvider);
            return obj;
        }

        [HttpDelete]
        [Route("{businessObjectIdentifier}/{scopeId}/{id}")]
        public void DeleteBusinessObjects([NotNull] string businessObjectIdentifier, [NotNull] string scopeId,
            [NotNull] string id)
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

        [NotNull]
        [HttpGet]
        [Route("{businessObjectIdentifier}/meta")]
        public BusinessObjectDescription GetBusinessObjectMeta([NotNull] string businessObjectIdentifier)
        {
            var type = schemaRegistry.GetTypeByTypeIdentifier(businessObjectIdentifier);
            var schema = schemaRegistry.GetSchemaByTypeIdentifier(businessObjectIdentifier);
            var typeInfo = TypeInfoExtractor.Extract(type, schema.PropertyDescriptionBuilder,
                schema.CustomPropertyConfigurationProvider);


            var typeMeta = PropertyHelpers.BuildTypeMetaInformation(type);

            if (typeInfo is ClassTypeInfo classTypeInfo)
            {
                foreach (var e in classTypeInfo.Properties)
                    typeMeta.Properties.Single(x => x.Name == e.Description.Name).Indexed = e.Description.IsSearchable;
            }

            return new BusinessObjectDescription
            {
                Identifier = businessObjectIdentifier,
                StorageType = BusinessObjectStorageType.SingleObjectPerRow,
                MySqlTableName = "kek",
                TypeMetaInformation = typeMeta,
            };
        }


        private readonly ISchemaRegistry schemaRegistry;
    }
}