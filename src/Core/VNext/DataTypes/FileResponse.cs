﻿namespace Kontur.DBViewer.Core.VNext.DataTypes
{
    public class FileResponse
    {
        public string Name { get; set; }
        public string ContentType { get; set; }
        public byte[] Content { get; set; }
        public bool IsInlineAttachment { get; set; }
    }
}