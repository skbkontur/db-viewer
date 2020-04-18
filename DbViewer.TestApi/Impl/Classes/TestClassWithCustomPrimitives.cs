using Cassandra;

namespace SkbKontur.DbViewer.TestApi.Impl.Classes
{
    public class TestClassWithCustomPrimitives
    {
        public BaseClass BaseClass { get; set; }
        public LocalTime LocalTime { get; set; }
        public TimeUuid TimeUuid { get; set; }
        public TimeUuid? NullableTimeUuid { get; set; }
    }
}