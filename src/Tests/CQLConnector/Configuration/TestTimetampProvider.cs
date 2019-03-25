using System;
using System.Threading.Tasks;

using Kontur.DBViewer.Recipes.CQL;

using SKBKontur.Catalogue.CassandraUtils.Cassandra.SessionTableQueryExtending.TimestampStoring;

namespace Kontur.DBViewer.Tests.CQLConnector.Configuration
{
    public class TestTimetampProvider : ITimestampProvider
    {
        private readonly ITimestampService timestampService;

        public TestTimetampProvider(ITimestampService timestampService)
        {
            this.timestampService = timestampService;
        }

        public Task<DateTimeOffset> GetTimestamp(string tableName)
        {
            return timestampService.NextTimestamp(tableName);
        }
    }
}