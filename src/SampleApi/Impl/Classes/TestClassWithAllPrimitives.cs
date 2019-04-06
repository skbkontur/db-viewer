using System;
using System.Collections.Generic;

namespace Kontur.DBViewer.SampleApi.Impl.Classes
{
    public class TestClassWithAllPrimitives
    {
        public string String { get; set; }
        public Guid Guid { get; set; }
        public Guid? NullableGuid { get; set; }
        public byte Byte { get; set; }
        public byte? NullableByte { get; set; }
        public char Char { get; set; }
        public char? NullableChar { get; set; }
        public int Int { get; set; }
        public int? NullableInt { get; set; }
        public long Long { get; set; }
        public long? NullableLong { get; set; }
        public decimal Decimal { get; set; }
        public decimal? NullableDecimal { get; set; }
        public DateTime DateTime { get; set; }
        public DateTime? NullableDateTime { get; set; }
        public DateTimeOffset DateTimeOffset { get; set; }
        public DateTimeOffset? NullableDateTimeOffset { get; set; }
        public TestEnum Enum { get; set; }
        public TestEnum? NullableEnum { get; set; }
        public int[] Array { get; set; }
        public List<int> List { get; set; }
        public Dictionary<string, int> Dictionary { get; set; }
        public HashSet<string> HashSet { get; set; }
    }
}