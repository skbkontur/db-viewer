using System;
using System.Diagnostics;
using System.Threading;

using Cassandra;
using Cassandra.Data.Linq;

namespace SkbKontur.DbViewer.TestApi.Cql
{
    public class CqlDbContext : IDisposable
    {
        public CqlDbContext()
        {
            session = TryConnectToCassandra(timeout : TimeSpan.FromMinutes(1), interval : TimeSpan.FromSeconds(1));
            session.CreateKeyspaceIfNotExists(CqlDbConnectorFactory.Keyspace);
        }

        public Table<T> GetTable<T>()
        {
            var table = new Table<T>(session);
            table.CreateIfNotExists();
            return table;
        }

        public void DropTable<T>()
        {
            var table = new Table<T>(session);
            session.Execute($"DROP TABLE IF EXISTS {table.KeyspaceName}.{table.Name};");
        }

        public void Dispose()
        {
            session.Dispose();
        }

        private static ISession TryConnectToCassandra(TimeSpan timeout, TimeSpan interval)
        {
            var sw = Stopwatch.StartNew();
            while (sw.Elapsed < timeout)
            {
                try
                {
                    var session = Cluster.Builder().AddContactPoint(Environment.GetEnvironmentVariable("CASSANDRA_ADDRESS") ?? "127.0.0.1").Build().Connect();
                    Console.WriteLine($"Successfully connected to cassandra after {sw.Elapsed.TotalSeconds} seconds");
                    return session;
                }
                catch (NoHostAvailableException)
                {
                }

                Thread.Sleep(interval);
            }

            throw new InvalidOperationException($"Failed to wait for local cassandra node to start in {timeout.TotalSeconds} seconds");
        }

        private readonly ISession session;
    }

    public static class CqlDbContextExtensions
    {
        public static void InsertDocument<T>(this CqlDbContext cassandraManager, T document)
        {
            cassandraManager.GetTable<T>().Insert(document).SetTimestamp(DateTimeOffset.UtcNow).Execute();
        }

        public static void InsertDocuments<T>(this CqlDbContext context, T[] documents)
        {
            var timestamp = DateTimeOffset.UtcNow;
            var table = context.GetTable<T>();
            foreach (var document in documents)
                table.Insert(document).SetTimestamp(timestamp).Execute();
        }
    }
}