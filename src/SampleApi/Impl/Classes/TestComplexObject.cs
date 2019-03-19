namespace Kontur.DBViewer.SampleApi.Impl.Classes
{
    public class TestComplexObject
    {
        [Indexed, Identity]
        public string Id { get; set; }

        [Indexed]
        public string Number { get; set; }

        public Nested1 Content { get; set; }
    }
}