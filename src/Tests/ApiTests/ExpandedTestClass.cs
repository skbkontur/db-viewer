using Kontur.DBViewer.SampleApi.Impl.Classes;

namespace Kontur.DBViewer.Tests.ApiTests
{
    public class ExpandedTestClass
    {
        public string Id { get; set; }
        public TestClassWithAllPrimitives Content { get; set; }
        public ClassForSerialization Serialized { get; set; }
    }
}