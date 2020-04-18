using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace SkbKontur.DbViewer.Helpers
{
    public class CsvWriter : BaseCsvWriter
    {
        public CsvWriter(params string[] header)
            : this(Encoding.UTF8, header)
        {
        }

        private CsvWriter(Encoding encoding, params string[] header)
            : base(header)
        {
            this.encoding = encoding;
            rows = new List<string[]>();
        }

        protected override void InnerAddRow(string[] fields)
        {
            rows.Add(fields);
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