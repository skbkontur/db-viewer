using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace Kontur.DBViewer.Core.VNext.Helpers
{
    public class CsvWriter : BaseCsvWriter
    {
        public CsvWriter([NotNull, ItemNotNull] params string[] header)
            : this(Encoding.UTF8, header)
        {
        }

        private CsvWriter([NotNull] Encoding encoding, [NotNull, ItemNotNull] params string[] header)
            : base(header)
        {
            this.encoding = encoding;
            rows = new List<string[]>();
        }

        protected override void InnerAddRow([NotNull] string[] fields)
        {
            rows.Add(fields);
        }

        public void WriteToFile([NotNull] string filename)
        {
            File.WriteAllLines(filename, GetLines(), encoding);
        }

        public byte[] GetBytes()
        {
            return encoding.GetPreamble().Concat(encoding.GetBytes(string.Join("\n", GetLines()))).ToArray();
        }

        private IEnumerable<string> GetLines()
        {
            return new[] {Header}.Concat(rows).Select(BuildCsvRow);
        }

        private readonly List<string[]> rows;
        private readonly Encoding encoding;
    }
}