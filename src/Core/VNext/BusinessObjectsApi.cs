using System;
using System.Collections.Generic;
using System.Linq;
using Kontur.DBViewer.Core.Attributes;
using Kontur.DBViewer.Core.DTO.TypeInfo;
using Kontur.DBViewer.Core.GenericHelpers;
using Kontur.DBViewer.Core.Schemas;
using Kontur.DBViewer.Core.TypeAndObjectBulding;
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
                Count = 1000,
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

        [NotNull]
        [HttpPost]
        [Route("{businessObjectIdentifier}/download")]
        public FileResponse DownloadBusinessObjects(
            [NotNull] string businessObjectIdentifier,
            [NotNull] [FromBody] BusinessObjectSearchRequest query)
        {
            var type = schemaRegistry.GetTypeByTypeIdentifier(businessObjectIdentifier);
            var results = schemaRegistry.GetConnector(businessObjectIdentifier)
                .Search(query.GetFilters(), query.GetSorts(), 0, 100000).GetAwaiter().GetResult();

            var properties = new List<string>();
            var getters = new List<Func<object, object>>();

            PropertyHelpers.BuildGettersForProperties(type, "", x => x, properties, getters);

            var excludedIndices = properties.Select((x, i) => (x, i)).Where(x => query.ExcludedFields.Contains(x.x))
                .Select(x => x.i).ToArray();
            var filteredProperties = properties.Where((x, i) => !excludedIndices.Contains(i)).ToArray();
            var filteredGetters = getters.Where((x, i) => !excludedIndices.Contains(i)).ToArray();

            var csvWriter = new CsvWriter(filteredProperties);
            foreach (var item in results)
                csvWriter.AddRow(filteredGetters.Select(f => PropertyHelpers.ToString(f, item)).ToArray());

            return new FileResponse
            {
                Content = csvWriter.GetBytes(),
                ContentType = "text/csv",
                Name = $"{businessObjectIdentifier}-{DateTime.UtcNow:yyyy-MM-dd-HHmm}.csv"
            };
        }

        [NotNull]
        [HttpPost]
        [Route("{businessObjectIdentifier}/details")]
        public object GetBusinessObjects([NotNull] string businessObjectIdentifier,
            [NotNull] [FromBody] BusinessObjectSearchRequest query)
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
        [Route("{businessObjectIdentifier}/delete")]
        public void DeleteBusinessObjects([NotNull] string businessObjectIdentifier, [NotNull] [FromBody] object obj)
        {
            var type = schemaRegistry.GetTypeByTypeIdentifier(businessObjectIdentifier);
            var schema = schemaRegistry.GetSchemaByTypeIdentifier(businessObjectIdentifier);
            var typeInfo = TypeInfoExtractor.Extract(type, schema.PropertyDescriptionBuilder,
                schema.CustomPropertyConfigurationProvider);
            var x = ObjectsConverter.ApiToStored(typeInfo, type, obj, schema.CustomPropertyConfigurationProvider);
            schemaRegistry.GetConnector(businessObjectIdentifier).Delete(x).GetAwaiter().GetResult();
        }

        [HttpPost]
        [Route("{businessObjectIdentifier}/update")]
        public void UpdateBusinessObjects([NotNull] string businessObjectIdentifier, [NotNull] [FromBody] object obj)
        {
            var type = schemaRegistry.GetTypeByTypeIdentifier(businessObjectIdentifier);
            var schema = schemaRegistry.GetSchemaByTypeIdentifier(businessObjectIdentifier);
            var typeInfo = TypeInfoExtractor.Extract(obj, type, schema.PropertyDescriptionBuilder,
                schema.CustomPropertyConfigurationProvider);
            var stored = ObjectsConverter.ApiToStored(typeInfo, type, obj, schema.CustomPropertyConfigurationProvider);
            schemaRegistry.GetConnector(businessObjectIdentifier).Write(stored).GetAwaiter().GetResult();
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