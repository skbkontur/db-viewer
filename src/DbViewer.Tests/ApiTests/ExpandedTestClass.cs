using SkbKontur.DbViewer.TestApi.Impl.Classes;

namespace SkbKontur.DbViewer.Tests.ApiTests
{
    public class ExpandedTestClass
    {
        public string Id { get; set; }
        public TestClassWithAllPrimitives Content { get; set; }
        public ClassForSerialization Serialized { get; set; }
        public DifficultEnum DifficultEnum => DifficultEnum.A;
        public A DifficultSerialized { get; set; }
        public ExpandedTestClassWithAllPrimitives CustomContent { get; set; }
    }
}