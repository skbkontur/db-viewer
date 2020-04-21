using System.Collections.Generic;

using Cassandra;

using SkbKontur.DbViewer.TestApi.Impl.Attributes;

namespace SkbKontur.DbViewer.TestApi.Impl.Classes
{
    public class RidiculousUseCasesClass
    {
        [Identity, Indexed]
        public string Id { get; set; }

        public LocalDate[] CustomPrimitiveArray { get; set; }
        public TestClassWithCustomPrimitives[] CustomContentArray { get; set; }
        public Dictionary<LocalDate, LocalTime> CustomPrimitiveDict { get; set; }
        public Dictionary<TimeUuid, TestClassWithCustomPrimitives> CustomObjectDict { get; set; }
    }
}