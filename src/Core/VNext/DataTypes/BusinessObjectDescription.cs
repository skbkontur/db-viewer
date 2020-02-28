namespace Kontur.DBViewer.Core.VNext.DataTypes
{
    public class BusinessObjectDescription
    {
        [NotNull]
        public string Identifier { get; set; }

        [CanBeNull]
        public string MySqlTableName { get; set; }

        public BusinessObjectStorageType StorageType { get; set; }

        public TypeMetaInformation TypeMetaInformation { get; set; }
    }
}