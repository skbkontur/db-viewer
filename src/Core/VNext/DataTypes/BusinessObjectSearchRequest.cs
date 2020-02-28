namespace Kontur.DBViewer.Core.VNext.DataTypes
{
    public class BusinessObjectSearchRequest
    {
        [CanBeNull, ItemNotNull]
        public Condition[] Conditions { get; set; }

        [CanBeNull]
        public Sort Sort { get; set; }
    }
}