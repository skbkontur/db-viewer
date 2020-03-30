using System;
using System.Threading.Tasks;

using SKBKontur.Catalogue.CassandraUtils.Cassandra.SessionTableQueryExtending.TimestampStoring;

using SkbKontur.DbViewer.Cql;

namespace SkbKontur.DbViewer.Tests.CqlConnector.Configuration
{
    public class TestTimetampProvider : ITimestampProvider
    {
        public TestTimetampProvider(ITimestampService timestampService)
        {
            this.timestampService = timestampService;
        }

        public Task<DateTimeOffset> GetTimestamp(string tableName)
        {
            return timestampService.NextTimestamp(tableName);
        }

        private readonly ITimestampService timestampService;
    }
}