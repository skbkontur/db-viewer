using System;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

using Newtonsoft.Json;

using NUnit.Framework;

using SkbKontur.DbViewer.DataTypes;

namespace SkbKontur.DbViewer.Tests.ApiTests
{
    public class ApiClient
    {
        public Task<ObjectIdentifier[]> GetTypesDescription()
        {
            return Request<ObjectIdentifier[]>(x => x.GetAsync("names"));
        }

        public Task<ObjectDescription> GetTypeMeta(string objectIdentifier)
        {
            return Request<ObjectDescription>(x => x.GetAsync($"{objectIdentifier}/meta"));
        }

        public Task<ObjectDetails> Read(string objectIdentifier, Condition[] filters)
        {
            var requestContent = new ObjectReadRequest {Conditions = filters};
            return Request<ObjectDetails>(x => x.PostAsync($"{objectIdentifier}/details", new StringContent(JsonConvert.SerializeObject(requestContent), Encoding.UTF8, "application/json")));
        }

        public Task<object> Write(string objectIdentifier, ObjectUpdateRequest query)
        {
            return Request<object>(x => x.PostAsync($"{objectIdentifier}/update", new StringContent(JsonConvert.SerializeObject(query), Encoding.UTF8, "application/json")));
        }

        private async Task<T> Request<T>(Func<HttpClient, Task<HttpResponseMessage>> func)
        {
            var baseUri = new Uri("http://localhost:5000/db-viewer/");

            var cookieContainer = new CookieContainer();
            cookieContainer.Add(new Cookie("isSuperUser", "true", "/", "localhost"));

            using (var handler = new HttpClientHandler {CookieContainer = cookieContainer})
            using (var client = new HttpClient(handler) {BaseAddress = baseUri})
            {
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                var result = await func(client);
                var content = await result.Content.ReadAsStringAsync();
                if (!result.IsSuccessStatusCode)
                    Assert.Fail("Error from server: " + content);
                return JsonConvert.DeserializeObject<T>(content);
            }
        }
    }
}