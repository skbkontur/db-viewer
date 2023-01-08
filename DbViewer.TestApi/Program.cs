using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;

namespace SkbKontur.DbViewer.TestApi
{
    public static class Program
    {
        public static void Main(string[] args)
        {
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(
                    webBuilder => webBuilder.UseStartup<Startup>()
                                            .UseUrls("http://0.0.0.0:5000"))
                .Build()
                .Run();
        }
    }
}