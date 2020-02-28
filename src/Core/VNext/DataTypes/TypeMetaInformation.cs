namespace Kontur.DBViewer.Core.VNext.DataTypes
{
    public class TypeMetaInformation
    {
        [NotNull]
        public string TypeName { get; set; }

        public bool IsArray { get; set; }

        [CanBeNull, ItemNotNull]
        public PropertyMetaInformation[] Properties { get; set; }

        [CanBeNull]
        public TypeMetaInformation ItemType { get; set; }

        [CanBeNull, ItemNotNull]
        public TypeMetaInformation[] GenericTypeArguments { get; set; }
    }
}