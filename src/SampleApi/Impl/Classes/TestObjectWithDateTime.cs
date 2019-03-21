using System;
using System.Collections.Generic;

namespace Kontur.DBViewer.SampleApi.Impl.Classes
{
    public class TestObjectWithAllPrimitives
    {
        [Identity, Indexed]
        public string Id { get; set; }
        public decimal Decimal { get; set; }
        public int Int { get; set; }
        public byte Byte { get; set; }
        public char Char { get; set; }
        public Guid Guid { get; set; }
        public HashSet<Nested3> HashSet { get; set; }
        public Dictionary<string, Nested3> Dictionary { get; set; }
        public Nested3[] Array { get; set; }
        public List<Nested3> List { get; set; }
    }
    
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