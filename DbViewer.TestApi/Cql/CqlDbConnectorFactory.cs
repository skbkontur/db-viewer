using System;
using System.Threading.Tasks;

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
            return (IDbConnector)Activator.CreateInstance(connectorType.MakeGenericType(typeof(T)), Context.GetTable<T>(), new TimestampProvider());
        }

        public const string Keyspace = "dbviewer";

        private CqlDbContext Context => context ??= new CqlDbContext();

        private readonly Type connectorType;

        private CqlDbContext context;
    }
}