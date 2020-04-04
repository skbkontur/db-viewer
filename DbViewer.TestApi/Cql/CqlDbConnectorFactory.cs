using System;
using System.Threading.Tasks;

using Cassandra;
using Cassandra.Data.Linq;

using SkbKontur.DbViewer.Connector;
using SkbKontur.DbViewer.Cql;

namespace SkbKontur.DbViewer.TestApi.Cql
{
    public class TimestampProvider : ITimestampProvider
    {
        public Task<DateTimeOffset> GetTimestamp(string tableName)
        {
            return Task.FromResult(DateTimeOffset.UtcNow);
        }
    }

    public class CqlDbConnectorFactory : IDbConnectorFactory
    {
        public CqlDbConnectorFactory()
        {
            session = Cluster.Builder().AddContactPoint("127.0.0.1").Build().Connect();
        }

        public IDbConnector CreateConnector<T>() where T : class
        {
            return new CqlDbConnector<T>(new Table<T>(session), new TimestampProvider());
        }

        public const string Keyspace = "dbviewer";

        private readonly ISession session;
    }
}