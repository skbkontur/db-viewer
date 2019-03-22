namespace Kontur.DBViewer.SampleApi.Impl.Classes
{
    public class TestObjectWithBools
    {
        [Indexed, Identity]
        public string Id { get; set; }
        
        [Indexed]
        public bool Indexed { get; set; }
        
        [Indexed]
        public bool? NullableIndexed { get; set; }
    }
}