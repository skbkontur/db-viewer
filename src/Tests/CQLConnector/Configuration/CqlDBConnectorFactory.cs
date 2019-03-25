using Kontur.DBViewer.Core.Connector;
using Kontur.DBViewer.Recipes.CQL;

using SKBKontur.Catalogue.CassandraUtils.Cassandra.SessionTableQueryExtending.PrimitiveStoring;

namespace Kontur.DBViewer.Tests.CQLConnector.Configuration
{
    public class CqlDBConnectorFactory : IDBConnectorFactory
    {
        private readonly ICassandraStorageFactory cassandraStorageFactory;

        public CqlDBConnectorFactory(ICassandraStorageFactory cassandraStorageFactory)
        {
            this.cassandraStorageFactory = cassandraStorageFactory;
        }

        public IDBConnector CreateConnector<T>() where T : class
        {
            var storage = cassandraStorageFactory.Get<T>();
            return new CqlDBConnector<T>(
                storage.Table,
                new TestTimetampProvider(storage.TimestampService)
            );
        }
    }
}