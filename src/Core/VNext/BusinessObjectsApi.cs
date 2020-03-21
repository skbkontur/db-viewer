using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Kontur.DBViewer.Core.Attributes;
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
            return schemaRegistry.GetAllSchemas().SelectMany(s => s.Types
                    .Select(x => new BusinessObjectDescription
                    {
                        Identifier = x.Type.Name,
                        SchemaDescription = s.Description
                    }))
                .ToArray();
        }

        [NotNull]
        [HttpGet]
        [Route("{businessObjectIdentifier}/meta")]
        public BusinessObjectDescription GetBusinessObjectMeta([NotNull] string businessObjectIdentifier)
        {
            var type = schemaRegistry.GetTypeByTypeIdentifier(businessObjectIdentifier);
            var schema = schemaRegistry.GetSchemaByTypeIdentifier(businessObjectIdentifier);
            var typeMeta = PropertyHelpers.BuildTypeMetaInformation(type, schema.PropertyDescriptionBuilder,
                schema.CustomPropertyConfigurationProvider);
            return new BusinessObjectDescription
            {
                Identifier = businessObjectIdentifier,
                SchemaDescription = schema.Description,
                TypeMetaInformation = typeMeta,
            };
        }

        [HttpPost]
        [NotNull, ItemNotNull]
        [Route("{businessObjectIdentifier}/search")]
        public async Task<SearchResult<object>> FindBusinessObjects(
            [NotNull] string businessObjectIdentifier,
            [NotNull] [FromBody] BusinessObjectSearchRequest query)
        {
            var type = schemaRegistry.GetTypeByTypeIdentifier(businessObjectIdentifier);
            var schema = schemaRegistry.GetSchemaByTypeIdentifier(businessObjectIdentifier);
            var countLimit = schema.Description.CountLimit;
            var connector = schemaRegistry.GetConnector(businessObjectIdentifier);
            var counts = await connector.Count(query.GetFilters(), countLimit + 1).ConfigureAwait(false);
            var results = await connector
                .Search(query.GetFilters(), query.GetSorts(), query.Offset ?? 0, query.Count ?? 20)
                .ConfigureAwait(false);
            var typeInfo = TypeInfoExtractor.Extract(type, schema.PropertyDescriptionBuilder,
                schema.CustomPropertyConfigurationProvider);
            var objects = results
                .Select(x =>
                    ObjectsConverter.StoredToApi(typeInfo, type, x, schema.CustomPropertyConfigurationProvider))
                .ToArray();

            return new SearchResult<object>
            {
                Count = counts ?? objects.Length,
                CountLimit = countLimit,
                Items = objects,
            };
        }

        [HttpPost]
        [NotNull, ItemNotNull]
        [Route("{businessObjectIdentifier}/download")]
        public async Task<DownloadResult> DownloadBusinessObjects(
            [NotNull] string businessObjectIdentifier,
            [NotNull] [FromBody] BusinessObjectSearchRequest query)
        {
            var type = schemaRegistry.GetTypeByTypeIdentifier(businessObjectIdentifier);
            var schema = schemaRegistry.GetSchemaByTypeIdentifier(businessObjectIdentifier);
            var downloadLimit = schema.Description.DownloadLimit;
            var count = await schemaRegistry.GetConnector(businessObjectIdentifier)
                .Count(query.GetFilters(), downloadLimit + 1)
                .ConfigureAwait(false);
            if (count > downloadLimit)
                return new DownloadResult
                {
                    File = null,
                    Count = (int) count,
                    CountLimit = downloadLimit,
                };

            var results = await schemaRegistry.GetConnector(businessObjectIdentifier)
                .Search(query.GetFilters(), query.GetSorts(), 0, downloadLimit).ConfigureAwait(false);

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

            return new DownloadResult
            {
                Count = count ?? 0,
                CountLimit = downloadLimit,
                File = new FileInfo
                {
                    Content = csvWriter.GetBytes(),
                    ContentType = "text/csv",
                    Name = $"{businessObjectIdentifier}-{DateTime.UtcNow:yyyy-MM-dd-HHmm}.csv"
                }
            };
        }

        [HttpPost]
        [NotNull, ItemNotNull]
        [Route("{businessObjectIdentifier}/details")]
        public async Task<BusinessObjectDetails> GetBusinessObjects([NotNull] string businessObjectIdentifier,
            [NotNull] [FromBody] BusinessObjectSearchRequest query)
        {
            var type = schemaRegistry.GetTypeByTypeIdentifier(businessObjectIdentifier);
            var schema = schemaRegistry.GetSchemaByTypeIdentifier(businessObjectIdentifier);
            var typeMeta = PropertyHelpers.BuildTypeMetaInformation(type, schema.PropertyDescriptionBuilder,
                schema.CustomPropertyConfigurationProvider);
            var result = await schemaRegistry.GetConnector(businessObjectIdentifier).Read(query.GetFilters())
                .ConfigureAwait(false);
            var typeInfo = TypeInfoExtractor.Extract(result, type, schema.PropertyDescriptionBuilder,
                schema.CustomPropertyConfigurationProvider);
            var obj = ObjectsConverter.StoredToApi(typeInfo, type, result, schema.CustomPropertyConfigurationProvider);
            return new BusinessObjectDetails
            {
                Object = obj,
                Meta = new BusinessObjectDescription
                {
                    Identifier = businessObjectIdentifier,
                    SchemaDescription = schema.Description,
                    TypeMetaInformation = typeMeta,
                }
            };
        }

        [NotNull]
        [HttpDelete]
        [Route("{businessObjectIdentifier}/delete")]
        public Task DeleteBusinessObjects([NotNull] string businessObjectIdentifier, [NotNull] [FromBody] object obj)
        {
            var type = schemaRegistry.GetTypeByTypeIdentifier(businessObjectIdentifier);
            var schema = schemaRegistry.GetSchemaByTypeIdentifier(businessObjectIdentifier);
            var typeInfo = TypeInfoExtractor.Extract(type, schema.PropertyDescriptionBuilder,
                schema.CustomPropertyConfigurationProvider);
            var x = ObjectsConverter.ApiToStored(typeInfo, type, obj, schema.CustomPropertyConfigurationProvider);
            return schemaRegistry.GetConnector(businessObjectIdentifier).Delete(x);
        }

        [HttpPost]
        [NotNull, ItemCanBeNull]
        [Route("{businessObjectIdentifier}/update")]
        public async Task<object> UpdateBusinessObjects([NotNull] string businessObjectIdentifier,
            [NotNull] [FromBody] object obj)
        {
            var type = schemaRegistry.GetTypeByTypeIdentifier(businessObjectIdentifier);
            var schema = schemaRegistry.GetSchemaByTypeIdentifier(businessObjectIdentifier);
            var typeInfo = TypeInfoExtractor.Extract(obj, type, schema.PropertyDescriptionBuilder,
                schema.CustomPropertyConfigurationProvider);
            var stored = ObjectsConverter.ApiToStored(typeInfo, type, obj, schema.CustomPropertyConfigurationProvider);
            var newObject = await schemaRegistry.GetConnector(businessObjectIdentifier).Write(stored)
                .ConfigureAwait(false);
            return ObjectsConverter.StoredToApi(typeInfo, type, newObject, schema.CustomPropertyConfigurationProvider);
        }

        private readonly ISchemaRegistry schemaRegistry;
    }
}