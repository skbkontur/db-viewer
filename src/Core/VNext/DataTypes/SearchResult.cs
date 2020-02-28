namespace Kontur.DBViewer.Core.VNext.DataTypes
{
    public class SearchResult<T>
    {
        [NotNull, ItemNotNull]
        public T[] Items { get; set; }

        public int Count { get; set; }
        public int CountLimit { get; set; }
    }
}