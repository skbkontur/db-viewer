using Topshelf;

namespace SkbKontur.DbViewer.TestApi
{
    public static class Program
    {
        public static void Main(string[] args)
        {
            HostFactory.Run(
                x =>
                    {
                        x.Service<Service>(
                            configurator =>
                                {
                                    configurator.ConstructUsing(name => new Service());
                                    configurator.WhenStarted((service, hostControl) => service.Start(hostControl));
                                    configurator.WhenStopped((service, hostControl) => service.Stop(hostControl));
                                });
                        x.RunAsLocalSystem();
                        x.SetDescription("SkbKontur.DbViewer.TestApi");
                        x.SetDisplayName("SkbKontur.DbViewer.TestApi");
                        x.SetServiceName("SkbKontur.DbViewer.TestApi");
                    });
        }
    }
}