using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using SkbKontur.DbViewer.Attributes;
using SkbKontur.DbViewer.Schemas;
using SkbKontur.DbViewer.TypeAndObjectBuilding;
using SkbKontur.DbViewer.VNext.DataTypes;
using SkbKontur.DbViewer.VNext.Helpers;

namespace SkbKontur.DbViewer.VNext
{
    public class DbViewerApi
    {
        public DbViewerApi(ISchemaRegistry schemaRegistry)
        {
            this.schemaRegistry = schemaRegistry;
        }

        [HttpGet]
        [Route("names")]
        [NotNull, ItemNotNull]
        public ObjectDescription[] GetNames()
        {
            return schemaRegistry.GetAllSchemas()
                                 .SelectMany(s => s.Types.Select(x => new ObjectDescription {Identifier = x.Type.Name, SchemaDescription = s.Description}))
                                 .ToArray();
        }

        [NotNull]
        [HttpGet]
        [Route("{objectIdentifier}/meta")]
        public ObjectDescription GetMeta([NotNull] string objectIdentifier)
        {
            var type = schemaRegistry.GetTypeByTypeIdentifier(objectIdentifier);
            var schema = schemaRegistry.GetSchemaByTypeIdentifier(objectIdentifier);
            var typeMeta = PropertyHelpers.BuildTypeMetaInformation(type, schema.PropertyDescriptionBuilder, schema.CustomPropertyConfigurationProvider);
            return new ObjectDescription
                {
                    Identifier = objectIdentifier,
                    SchemaDescription = schema.Description,
                    TypeMetaInformation = typeMeta,
                };
        }

        [HttpPost]
        [NotNull, ItemNotNull]
        [Route("{objectIdentifier}/search")]
        public async Task<SearchResult<object>> SearchObjects([NotNull] string objectIdentifier, [NotNull] [FromBody] ObjectSearchRequest query)
        {
            var type = schemaRegistry.GetTypeByTypeIdentifier(objectIdentifier);
            var schema = schemaRegistry.GetSchemaByTypeIdentifier(objectIdentifier);
            var countLimit = schema.Description.CountLimit;
            var connector = schemaRegistry.GetConnector(objectIdentifier);
            var counts = await connector.Count(query.GetFilters(), countLimit + 1).ConfigureAwait(false);
            var results = await connector.Search(query.GetFilters(), query.GetSorts(), query.Offset ?? 0, query.Count ?? 20).ConfigureAwait(false);
            var typeInfo = TypeInfoExtractor.Extract(type, schema.PropertyDescriptionBuilder, schema.CustomPropertyConfigurationProvider);
            var objects = results.Select(x => ObjectsConverter.StoredToApi(typeInfo, type, x, schema.CustomPropertyConfigurationProvider)).ToArray();

            return new SearchResult<object>
                {
                    Count = counts ?? objects.Length,
                    CountLimit = countLimit,
                    Items = objects,
                };
        }

        [HttpPost]
        [NotNull, ItemNotNull]
        [Route("{objectIdentifier}/download")]
        public async Task<DownloadResult> DownloadObjects([NotNull] string objectIdentifier, [NotNull] [FromBody] ObjectSearchRequest query)
        {
            var type = schemaRegistry.GetTypeByTypeIdentifier(objectIdentifier);
            var schema = schemaRegistry.GetSchemaByTypeIdentifier(objectIdentifier);
            var downloadLimit = schema.Description.DownloadLimit;
            var count = await schemaRegistry.GetConnector(objectIdentifier).Count(query.GetFilters(), downloadLimit + 1).ConfigureAwait(false);
            if (count > downloadLimit)
                return new DownloadResult
                    {
                        File = null,
                        Count = (int)count,
                        CountLimit = downloadLimit,
                    };

            var results = await schemaRegistry.GetConnector(objectIdentifier).Search(query.GetFilters(), query.GetSorts(), 0, downloadLimit).ConfigureAwait(false);

            var properties = new List<string>();
            var getters = new List<Func<object, object>>();

            PropertyHelpers.BuildGettersForProperties(type, "", x => x, properties, getters);

            var excludedIndices = properties.Select((x, i) => (x, i)).Where(x => query.ExcludedFields.Contains(x.x)).Select(x => x.i).ToArray();
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
                            Name = $"{objectIdentifier}-{DateTime.UtcNow:yyyy-MM-dd-HHmm}.csv"
                        }
                };
        }

        [HttpPost]
        [NotNull, ItemNotNull]
        [Route("{objectIdentifier}/details")]
        public async Task<ObjectDetails> ReadObject([NotNull] string objectIdentifier, [NotNull] [FromBody] ObjectSearchRequest query)
        {
            var type = schemaRegistry.GetTypeByTypeIdentifier(objectIdentifier);
            var schema = schemaRegistry.GetSchemaByTypeIdentifier(objectIdentifier);
            var typeMeta = PropertyHelpers.BuildTypeMetaInformation(type, schema.PropertyDescriptionBuilder, schema.CustomPropertyConfigurationProvider);
            var result = await schemaRegistry.GetConnector(objectIdentifier).Read(query.GetFilters()).ConfigureAwait(false);
            var typeInfo = TypeInfoExtractor.Extract(result, type, schema.PropertyDescriptionBuilder, schema.CustomPropertyConfigurationProvider);
            var obj = ObjectsConverter.StoredToApi(typeInfo, type, result, schema.CustomPropertyConfigurationProvider);
            return new ObjectDetails
                {
                    Object = obj,
                    Meta = new ObjectDescription
                        {
                            Identifier = objectIdentifier,
                            SchemaDescription = schema.Description,
                            TypeMetaInformation = typeMeta,
                        }
                };
        }

        [NotNull]
        [HttpDelete]
        [Route("{objectIdentifier}/delete")]
        public Task DeleteObject([NotNull] string objectIdentifier, [NotNull] [FromBody] object obj)
        {
            var type = schemaRegistry.GetTypeByTypeIdentifier(objectIdentifier);
            var schema = schemaRegistry.GetSchemaByTypeIdentifier(objectIdentifier);
            var typeInfo = TypeInfoExtractor.Extract(type, schema.PropertyDescriptionBuilder, schema.CustomPropertyConfigurationProvider);
            var x = ObjectsConverter.ApiToStored(typeInfo, type, obj, schema.CustomPropertyConfigurationProvider);
            return schemaRegistry.GetConnector(objectIdentifier).Delete(x);
        }

        [HttpPost]
        [NotNull, ItemCanBeNull]
        [Route("{objectIdentifier}/update")]
        public async Task<object> UpdateObject([NotNull] string objectIdentifier, [NotNull] [FromBody] object obj)
        {
            var type = schemaRegistry.GetTypeByTypeIdentifier(objectIdentifier);
            var schema = schemaRegistry.GetSchemaByTypeIdentifier(objectIdentifier);
            var typeInfo = TypeInfoExtractor.Extract(obj, type, schema.PropertyDescriptionBuilder, schema.CustomPropertyConfigurationProvider);
            var stored = ObjectsConverter.ApiToStored(typeInfo, type, obj, schema.CustomPropertyConfigurationProvider);
            var newObject = await schemaRegistry.GetConnector(objectIdentifier).Write(stored).ConfigureAwait(false);
            return ObjectsConverter.StoredToApi(typeInfo, type, newObject, schema.CustomPropertyConfigurationProvider);
        }

        private readonly ISchemaRegistry schemaRegistry;
    }
}