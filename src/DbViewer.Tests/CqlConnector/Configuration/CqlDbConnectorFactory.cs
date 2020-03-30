using SKBKontur.Catalogue.CassandraUtils.Cassandra.SessionTableQueryExtending.PrimitiveStoring;

using SkbKontur.DbViewer.Connector;
using SkbKontur.DbViewer.Cql;

namespace SkbKontur.DbViewer.Tests.CqlConnector.Configuration
{
    public class CqlDbConnectorFactory : IDbConnectorFactory
    {
        public CqlDbConnectorFactory(ICassandraStorageFactory cassandraStorageFactory)
        {
            this.cassandraStorageFactory = cassandraStorageFactory;
        }

        public IDbConnector CreateConnector<T>() where T : class
        {
            var storage = cassandraStorageFactory.Get<T>();
            return new CqlDbConnector<T>(storage.Table, new TestTimestampProvider(storage.TimestampService));
        }

        private readonly ICassandraStorageFactory cassandraStorageFactory;
    }
}