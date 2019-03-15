using System.Linq;

using Kontur.DBViewer.Core.DTO;
using Kontur.DBViewer.Core.Schemas;

using Newtonsoft.Json.Linq;

namespace Kontur.DBViewer.Core
{
    public class DBViewerControllerImpl
    {
        private readonly SchemaRegistry schemaRegistry;

        public DBViewerControllerImpl(SchemaRegistry schemaRegistry)
        {
            this.schemaRegistry = schemaRegistry;
        }

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

        public object[] Find(string typeIdentifier, FindModel filter)
        {
            return schemaRegistry.GetSearcher(typeIdentifier).Search(filter.Filters, filter.Sorts, filter.From, filter.Count);
        }
        
        public int? Count(string typeIdentifier, CountModel model)
        {
            return schemaRegistry.GetSearcher(typeIdentifier).Count(model.Filters, model.Limit);
        }

        public ObjectDetailsModel Read(string typeIdentifier, ReadModel filters)
        {
            var type = schemaRegistry.GetTypeByTypeIdentifier(typeIdentifier);
            return new ObjectDetailsModel
                {
                    Object = schemaRegistry.GetSearcher(typeIdentifier).Read(filters.Filters),
                    TypeInfo = schemaRegistry.GetSchemaByTypeIdentifier(typeIdentifier).TypeInfoExtractor.GetShape(type),
                };
        }

        public void Delete(string typeIdentifier, object @obj)
        {
            var type = schemaRegistry.GetTypeByTypeIdentifier(typeIdentifier);
            schemaRegistry.GetSearcher(typeIdentifier).Delete(((JObject)@obj).ToObject(type));
        }

        public object Write(string typeIdentifier, object @obj)
        {
            var type = schemaRegistry.GetTypeByTypeIdentifier(typeIdentifier);
            return schemaRegistry.GetSearcher(typeIdentifier).Write(((JObject)@obj).ToObject(type));
        }
    }
}