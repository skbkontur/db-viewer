using System.Linq;
using System.Runtime.CompilerServices;

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
                                              Shape = schema.TypeInfoExtractor.GetShape(x.Type),
                                          }))
                                      .OrderBy(x => x.Name).ToArray(),
                };
        }

        [HttpPost, Route("{typeIdentifier}/Find")]
        public object[] Find(string typeIdentifier, [FromBody] FindModel filter)
        {
            return schemaRegistry.GetSearcher(typeIdentifier).Search(filter.Filters, filter.Sorts, filter.From, filter.Count);
        }
        
        [HttpPost, Route("{typeIdentifier}/Count")]
        public int? Count(string typeIdentifier, [FromBody] CountModel model)
        {
            return schemaRegistry.GetSearcher(typeIdentifier).Count(model.Filters, model.Limit);
        }

        [HttpPost, Route("{typeIdentifier}/Read")]
        public ObjectDetailsModel Read(string typeIdentifier, [FromBody] ReadModel filters)
        {
            var type = schemaRegistry.GetTypeByTypeIdentifier(typeIdentifier);
            return new ObjectDetailsModel
                {
                    Object = schemaRegistry.GetSearcher(typeIdentifier).Read(filters.Filters),
                    TypeInfo = schemaRegistry.GetSchemaByTypeIdentifier(typeIdentifier).TypeInfoExtractor.GetShape(type),
                };
        }

        [HttpPost, Route("{typeIdentifier}/Delete")]
        public void Delete(string typeIdentifier, [FromBody] object obj)
        {
            var type = schemaRegistry.GetTypeByTypeIdentifier(typeIdentifier);
            schemaRegistry.GetSearcher(typeIdentifier).Delete(obj);
        }

        [HttpPost, Route("{typeIdentifier}/Write")]
        public object Write(string typeIdentifier, [FromBody] object obj)
        {
            var type = schemaRegistry.GetTypeByTypeIdentifier(typeIdentifier);
            return schemaRegistry.GetSearcher(typeIdentifier).Write(obj);
        }
    }
}