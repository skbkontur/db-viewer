using System.Threading.Tasks;
using System.Web.Http;
using Kontur.DBViewer.Core;
using Kontur.DBViewer.Core.DTO;

namespace Kontur.DBViewer.SampleApi.Controllers
{
    [RoutePrefix("DBViewer")]
    public class DbViewerController : ApiController
    {
        private readonly DBViewerControllerImpl impl;

        public DbViewerController()
        {
            var schemaRegistry = SchemaRegistryProvider.GetSchemaRegistry();
            impl = new DBViewerControllerImpl(schemaRegistry);
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
            await impl.Delete(typeIdentifier, obj);
        }

        [HttpPost, Route("{typeIdentifier}/Write")]
        public async Task<object> Write(string typeIdentifier, [FromBody] object @obj)
        {
            return await impl.Write(typeIdentifier, obj);
        }
        
        
    }
}