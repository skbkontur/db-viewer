using SKBKontur.Catalogue.CassandraUtils.Cassandra.Commons.Mapping;
using SKBKontur.Catalogue.CassandraUtils.Cassandra.Commons.Mapping.Declarative;

namespace Kontur.DBViewer.Tests.CQLConnector.Configuration
{
    public class CassandraCoordinatesSubstitution : ICassandraCoordinatesSubstitution
    {
        public KeyspaceTableNamePair Substitute(string keyspace, string table)
        {
            return new KeyspaceTableNamePair(keyspace, table);
        }

        public string SubstituteKeyspace(string keyspace)
        {
            if(keyspace == null)
                return null;
            return SubstituteKeyspaceInternal(keyspace);
        }

        public string SubstituteTable(string table)
        {
            if(table == null)
                return null;
            return SubstituteTableInternal(table);
        }

        protected virtual string SubstituteKeyspaceInternal(string keyspace)
        {
            return keyspace;
        }

        protected virtual string SubstituteTableInternal(string table)
        {
            return table;
        }
    }
}