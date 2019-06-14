using Kontur.DBViewer.Recipes.CQL.DTO;

namespace Kontur.DBViewer.Tests.ApiTests
{
    public class ExpandedTestClassWithAllPrimitives
    {
        public CassandraLocalTime LocalTime { get; set; }
        public string TimeUuid { get; set; }
        public string NullableTimeUuid { get; set; }
    }
}