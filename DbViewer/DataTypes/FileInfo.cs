using System.IO;

namespace SkbKontur.DbViewer.DataTypes
{
    public class FileInfo
    {
        public string Name { get; set; }
        public string ContentType { get; set; }
        public Stream Content { get; set; }
    }
}