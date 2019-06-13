using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Kontur.DBViewer.Core.DTO;
using Newtonsoft.Json;

namespace Kontur.DBViewer.Tests.ApiTests
{
    public class ApiClient
    {
        public Task<TypesListModel> GetTypesDescription()
        {
            return Request<TypesListModel>(x => x.GetAsync("List"));
        }

        public Task<ObjectDetailsModel> Read(string typeIdentifier, Filter[] filters)
        {
            return Request<ObjectDetailsModel>(x => x.PostAsJsonAsync($"{typeIdentifier}/Read", new ReadModel
            {
                Filters = filters,
            }));
        }

        public Task<T> Write<T>(string typeIdentifier, T @object)
        {
            return Request<T>(x => x.PostAsJsonAsync($"{typeIdentifier}/Write", @object));
        }

        private async Task<T> Request<T>(Func<HttpClient, Task<HttpResponseMessage>> func)
        {
            var baseUri = new Uri("http://localhost:7777/DBViewer/");
            using (var handler = new HttpClientHandler())
            using (var client = new HttpClient(handler) {BaseAddress = baseUri})
            {
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                var result = await func(client);
                result.EnsureSuccessStatusCode();
                var content = await result.Content.ReadAsStringAsync();
                return JsonConvert.DeserializeObject<T>(content);
            }
        }
    }
}