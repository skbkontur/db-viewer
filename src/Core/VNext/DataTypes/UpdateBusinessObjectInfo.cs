using System;

namespace Kontur.DBViewer.Core.VNext.DataTypes
{
    public class UpdateBusinessObjectInfo
    {
        [NotNull]
        public string Path { get; set; }

        [CanBeNull]
        public string Value { get; set; }

        public DateTime LastModificationDateTime { get; set; }
    }
}