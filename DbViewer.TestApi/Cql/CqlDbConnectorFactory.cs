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
        public CqlDbConnectorFactory(Type connectorType)
        {
            if (!connectorType.IsGenericTypeDefinition)
                throw new InvalidOperationException("Expected GenericTypeDefinition");
            this.connectorType = connectorType;
        }

        public IDbConnector CreateConnector<T>() where T : class
        {
            return (IDbConnector)Activator.CreateInstance(connectorType.MakeGenericType(typeof(T)), new Table<T>(Session), new TimestampProvider());
        }

        public const string Keyspace = "dbviewer";

        private ISession Session => session ??= Cluster.Builder().AddContactPoint("127.0.0.1").Build().Connect();

        private readonly Type connectorType;

        private ISession session;
    }
}