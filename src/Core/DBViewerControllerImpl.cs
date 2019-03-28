using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;

using Kontur.DBViewer.Core.Attributes;
using Kontur.DBViewer.Core.DTO;
using Kontur.DBViewer.Core.Schemas;

[assembly:InternalsVisibleTo("Kontur.DBViewer.TypeScriptGenerator")]
namespace Kontur.DBViewer.Core
{
    public class DBViewerControllerImpl
    {
        private readonly ISchemaRegistry schemaRegistry;

        public DBViewerControllerImpl(ISchemaRegistry schemaRegistry)
        {
            this.schemaRegistry = schemaRegistry;
        }

        [HttpGet, Route("List")]
        public TypesListModel GetTypes()
        {
            var allSchemas = schemaRegistry.GetAllSchemas();
            return new TypesListModel
                {
                    Types = allSchemas.SelectMany(schema => schema.Types.Select(x => new TypeModel
                                          {
                                              Name = x.TypeIdentifier,
                                              SchemaDescription = schema.Description,
                                              Shape = schema.TypeInfoExtractor.Extract(x.Type),
                                          }))
                                      .OrderBy(x => x.Name).ToArray(),
                };
        }

        [HttpPost, Route("{typeIdentifier}/Find")]
        public async Task<object[]> Find(string typeIdentifier, [FromBody] FindModel filter)
        {
            return await schemaRegistry.GetConnector(typeIdentifier).Search(filter.Filters, filter.Sorts, filter.From, filter.Count).ConfigureAwait(false);
        }
        
        [HttpPost, Route("{typeIdentifier}/Count")]
        public async Task<int?> Count(string typeIdentifier, [FromBody] CountModel model)
        {
            return await schemaRegistry.GetConnector(typeIdentifier).Count(model.Filters, model.Limit).ConfigureAwait(false);
        }

        [HttpPost, Route("{typeIdentifier}/Read")]
        public async Task<ObjectDetailsModel> Read(string typeIdentifier, [FromBody] ReadModel filters)
        {
            var type = schemaRegistry.GetTypeByTypeIdentifier(typeIdentifier);
            return new ObjectDetailsModel
                {
                    Object = await schemaRegistry.GetConnector(typeIdentifier).Read(filters.Filters).ConfigureAwait(false),
                    TypeInfo = schemaRegistry.GetSchemaByTypeIdentifier(typeIdentifier).TypeInfoExtractor.Extract(type),
                };
        }

        [HttpPost, Route("{typeIdentifier}/Delete")]
        public async Task Delete(string typeIdentifier, [FromBody] object obj)
        {
            await schemaRegistry.GetConnector(typeIdentifier).Delete(obj).ConfigureAwait(false);
        }

        [HttpPost, Route("{typeIdentifier}/Write")]
        public async Task<object> Write(string typeIdentifier, [FromBody] object obj)
        {
            return await schemaRegistry.GetConnector(typeIdentifier).Write(obj).ConfigureAwait(false);
        }
    }
}