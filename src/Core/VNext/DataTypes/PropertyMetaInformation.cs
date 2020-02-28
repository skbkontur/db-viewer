namespace Kontur.DBViewer.Core.VNext.DataTypes
{
    public class PropertyMetaInformation
    {
        [NotNull]
        public string Name { get; set; }

        public bool Indexed { get; set; }

        public TypeMetaInformation Type { get; set; }
    }
}