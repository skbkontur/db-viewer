using System;
using System.Collections.Generic;

namespace Kontur.DBViewer.SampleApi.Impl.Classes
{
    public class Nested2
    {
        public DateTime NestedDate { get; set; }
        public string[] NestedStringArray { get; set; }
        public Nested3[] NestedComplexArray { get; set; }
        public List<Nested3> NestedComplexList { get; set; }
    }
}