using SKBKontur.Catalogue.CassandraUtils.Cassandra.Commons.Mapping.Declarative.ExtendedDefinition;
using SKBKontur.Catalogue.CassandraUtils.Cassandra.SessionTableQueryExtending.TimestampStoring;

namespace SkbKontur.DbViewer.Tests.CqlConnector.Configuration
{
    public class TimestampCellCoordinates : ExtendedTableDefinition<TimestampCell>
    {
        public override string Keyspace => "dbviewer";
        public override string Table => "timestamp";
        public override bool UseLocalTimestamp => false;
    }
}