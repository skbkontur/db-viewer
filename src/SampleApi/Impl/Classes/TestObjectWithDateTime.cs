using System;

namespace Kontur.DBViewer.SampleApi.Impl.Classes
{
    public class TestObjectWithDateTime
    {
        [Indexed, Identity]
        public string Id { get; set; }

        [Indexed]
        public DateTime Indexed { get; set; }

        [Indexed]
        public DateTime? IndexedNullable { get; set; }

        public DateTime NotIndexed { get; set; }
    }
}