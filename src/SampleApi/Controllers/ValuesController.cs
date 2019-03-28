using System;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;

using Kontur.DBViewer.Core;
using Kontur.DBViewer.Core.DTO;
using Kontur.DBViewer.Core.Schemas;
using Kontur.DBViewer.SampleApi.Impl;
using Kontur.DBViewer.SampleApi.Impl.Classes;

using Newtonsoft.Json.Linq;

namespace Kontur.DBViewer.SampleApi.Controllers
{
    [RoutePrefix("DBViewer")]
    public class ValuesController : ApiController
    {
        private readonly DBViewerControllerImpl impl;
        private readonly SchemaRegistry schemaRegistry;

        public ValuesController()
        {
            schemaRegistry = new SchemaRegistry();
            schemaRegistry.Add(
                new Schema
                    {
                        Description = new SchemaDescription
                            {
                                Countable = true,
                                SchemaName = "SampleSchema",
                                MaxCountLimit = 10_000,
                                DefaultCountLimit = 100,
                                EnableDefaultSearch = false,
                            },
                        Types = BuildTypeDescriptions(
                            typeof(TestObjectWithRequiredField),
                            typeof(TestComplexObject),
                            typeof(TestObjectWithDateTime),
                            typeof(TestObjectWithEnums),
                            typeof(TestObjectWithStrings),
                            typeof(TestObjectWithAllPrimitives),
                            typeof(TestObjectWithBools)
                        ),
                        PropertyDescriptionBuilder = new SampleTypeInfoExtractor(),
                        ConnectorsFactory = new SampleIdbConnectorFactory(),
                    }
            );
            impl = new DBViewerControllerImpl(schemaRegistry);
        }

        private TypeDescription[] BuildTypeDescriptions(params Type[] types)
        {
            return types.Select(type => new TypeDescription
                {
                    Type = type,
                    TypeIdentifier = type.Name,
                }).ToArray();
        }

        [HttpGet, Route("List")]
        public TypesListModel GetTypes()
        {
            return impl.GetTypes();
        }

        [HttpPost, Route("{typeIdentifier}/Find")]
        public Task<object[]> Find(string typeIdentifier, [FromBody] FindModel filter)
        {
            return impl.Find(typeIdentifier, filter);
        }

        [HttpPost, Route("{typeIdentifier}/Count")]
        public Task<int?> Count(string typeIdentifier, [FromBody] CountModel model)
        {
            return impl.Count(typeIdentifier, model);
        }

        [HttpPost, Route("{typeIdentifier}/Read")]
        public Task<ObjectDetailsModel> Read(string typeIdentifier, [FromBody] ReadModel filters)
        {
            return impl.Read(typeIdentifier, filters);
        }

        [HttpPost, Route("{typeIdentifier}/Delete")]
        public async Task Delete(string typeIdentifier, [FromBody] object @obj)
        {
            var type = schemaRegistry.GetTypeByTypeIdentifier(typeIdentifier);
            await impl.Delete(typeIdentifier, ((JObject)obj).ToObject(type));
        }

        [HttpPost, Route("{typeIdentifier}/Write")]
        public async Task<object> Write(string typeIdentifier, [FromBody] object @obj)
        {
            var type = schemaRegistry.GetTypeByTypeIdentifier(typeIdentifier);
            return await impl.Write(typeIdentifier, ((JObject)obj).ToObject(type));
        }
    }
}