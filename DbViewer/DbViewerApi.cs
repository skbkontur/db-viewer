using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;

using SkbKontur.DbViewer.Attributes;
using SkbKontur.DbViewer.DataTypes;
using SkbKontur.DbViewer.Helpers;
using SkbKontur.DbViewer.Schemas;

[assembly : InternalsVisibleTo("SkbKontur.DbViewer.TypeScriptGenerator")]

namespace SkbKontur.DbViewer
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
        public ObjectIdentifier[] GetNames()
        {
            return schemaRegistry.GetAllSchemas()
                                 .SelectMany(s => s.Types.Select(x => new ObjectIdentifier {Identifier = x.Type.Name, SchemaDescription = s.Description}))
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
        public async Task<SearchResult> SearchObjects([NotNull] string objectIdentifier, [NotNull] [FromBody] ObjectSearchRequest query)
        {
            var type = schemaRegistry.GetTypeByTypeIdentifier(objectIdentifier);
            var schema = schemaRegistry.GetSchemaByTypeIdentifier(objectIdentifier);
            var offset = query.Offset ?? 0;
            var count = query.Count ?? 20;
            var countLimit = schema.Description.CountLimit;
            if (offset + count > countLimit)
                throw new InvalidOperationException($"Expected offset ({offset}) + count ({count}) to be less than countLimit ({countLimit})");

            var connector = schemaRegistry.GetConnector(objectIdentifier);
            var counts = await connector.Count(query.Conditions, countLimit + 1).ConfigureAwait(false);
            var results = await connector.Search(query.Conditions, query.Sorts, query.Offset ?? 0, query.Count ?? 20).ConfigureAwait(false);
            var typeMeta = PropertyHelpers.BuildTypeMetaInformation(type, schema.PropertyDescriptionBuilder, schema.CustomPropertyConfigurationProvider);
            var objects = results.Select(x => ObjectsConverter.StoredToApi(typeMeta, type, x, schema.CustomPropertyConfigurationProvider)).ToArray();

            return new SearchResult
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
            var count = await schemaRegistry.GetConnector(objectIdentifier).Count(query.Conditions, downloadLimit + 1).ConfigureAwait(false);
            if (count > downloadLimit)
                return new DownloadResult
                    {
                        File = null,
                        Count = (int)count,
                        CountLimit = downloadLimit,
                    };

            var results = await schemaRegistry.GetConnector(objectIdentifier).Search(query.Conditions, query.Sorts, 0, downloadLimit).ConfigureAwait(false);

            var properties = new List<string>();
            var getters = new List<Func<object, object>>();

            PropertyHelpers.BuildGettersForProperties(type, "", x => x, properties, getters, schema.CustomPropertyConfigurationProvider);

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
        public async Task<ObjectDetails> ReadObject([NotNull] string objectIdentifier, [NotNull] [FromBody] ObjectReadRequest query)
        {
            var type = schemaRegistry.GetTypeByTypeIdentifier(objectIdentifier);
            var schema = schemaRegistry.GetSchemaByTypeIdentifier(objectIdentifier);
            var result = await schemaRegistry.GetConnector(objectIdentifier).Read(query.Conditions).ConfigureAwait(false);
            var typeMeta = PropertyHelpers.BuildTypeMetaInformation(result, type, schema.PropertyDescriptionBuilder, schema.CustomPropertyConfigurationProvider);
            var obj = ObjectsConverter.StoredToApi(typeMeta, type, result, schema.CustomPropertyConfigurationProvider);
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
        public Task DeleteObject([NotNull] string objectIdentifier, [NotNull] [FromBody] ObjectReadRequest query)
        {
            return schemaRegistry.GetConnector(objectIdentifier).Delete(query.Conditions);
        }

        [HttpPost]
        [NotNull, ItemCanBeNull]
        [Route("{objectIdentifier}/update")]
        public async Task<object> UpdateObject([NotNull] string objectIdentifier, [NotNull] [FromBody] ObjectUpdateRequest query)
        {
            var type = schemaRegistry.GetTypeByTypeIdentifier(objectIdentifier);
            var schema = schemaRegistry.GetSchemaByTypeIdentifier(objectIdentifier);
            var oldObject = await schemaRegistry.GetConnector(objectIdentifier).Read(query.Conditions).ConfigureAwait(false);
            var updatedObject = ObjectPropertyEditor.SetValue(oldObject, query.Path, query.Value, schema.CustomPropertyConfigurationProvider);
            var newObject = await schemaRegistry.GetConnector(objectIdentifier).Write(updatedObject).ConfigureAwait(false);
            var typeMeta = PropertyHelpers.BuildTypeMetaInformation(newObject, type, schema.PropertyDescriptionBuilder, schema.CustomPropertyConfigurationProvider);
            return ObjectsConverter.StoredToApi(typeMeta, type, newObject, schema.CustomPropertyConfigurationProvider);
        }

        private readonly ISchemaRegistry schemaRegistry;
    }
}