﻿namespace Kontur.DBViewer.Core.VNext.DataTypes
{
    public class FileResponse
    {
        [NotNull]
        public string Name { get; set; }

        public string ContentType { get; set; }

        [NotNull]
        public byte[] Content { get; set; }

        public bool IsInlineAttachment { get; set; }
    }
}