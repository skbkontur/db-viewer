using Topshelf;

namespace Kontur.DBViewer.SampleApi
{
    class Program
    {
        static void Main(string[] args)
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
                    x.SetDescription("DBViewer.SampleApi");
                    x.SetDisplayName("DBViewer.SampleApi");
                    x.SetServiceName("DBViewer.SampleApi");
                });
        }
    }
}