using Cassandra;

namespace SkbKontur.DbViewer.TestApi.Impl.Classes
{
    public class TestClassWithCustomPrimitives
    {
        public LocalTime LocalTime { get; set; }
        public TimeUuid TimeUuid { get; set; }
        public TimeUuid? NullableTimeUuid { get; set; }
    }
}