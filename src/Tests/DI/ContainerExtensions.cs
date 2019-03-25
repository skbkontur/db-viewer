using Alko.Configuration.Settings;
using Alko.Configuration.Settings.TopologySearch;

using GroboContainer.Core;

using SKBKontur.Catalogue.CassandraUtils.Cassandra.Commons.SessionsManager;
using SKBKontur.Catalogue.CassandraUtils.Cassandra.Commons.Settings;

namespace Kontur.DBViewer.Tests.DI
{
    public static class ContainerExtensions
    {
        public static void Configure(this IContainer container)
        {
            var topologyDependencies = container.Get<ITopologyDependencies>();
            var topologyFileLocation = topologyDependencies.GetTopologyFileLocation("cassandra");
            var applicationSettings = ApplicationSettings.LoadDefault("tests.csf");
            container.Configurator.ForAbstraction<IApplicationSettings>().UseInstances(applicationSettings);
            container.Configurator.ForAbstraction<ICassandraSessionsManager>().UseInstances(
                new MultipleCassandraSessionsManager(MultipleCassandraSettingsBuilder.Create(topologyFileLocation)));
        }
    }
}