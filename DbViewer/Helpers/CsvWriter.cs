using System;
using System.Linq;
using System.Text;

namespace SkbKontur.DbViewer.Helpers
{
    public class CsvFormatter
    {
        public CsvFormatter(object?[] data, string[] properties, Func<object?, object?>[] getters)
        {
            this.data = data;
            this.properties = properties;
            this.getters = getters;
        }

        public byte[] GetHeader()
        {
            var header = $"sep=;\n{string.Join(";", properties.Select(FormatElement))}\n";
            return Encoding.UTF8.GetPreamble().Concat(Encoding.UTF8.GetBytes(header)).ToArray();
        }

        public byte[] GetRows(int start, int end)
        {
            var sb = new StringBuilder();
            end = Math.Min(end, data.Length);
            for (var i = start; i < end; i++)
            {
                for (var j = 0; j < getters.Length; j++)
                {
                    sb.Append(PropertyHelpers.ToString(getters[j], data[i]));
                    sb.Append(j < getters.Length - 1 ? ';' : '\n');
                }
            }
            return Encoding.UTF8.GetBytes(sb.ToString());
        }

        private static string FormatElement(string element)
        {
            element = element.Replace("\"", "\"\"");
            if (long.TryParse(element, out _) || double.TryParse(element, out _))
                return $"=\"{element}\"";
            return $"\"{element}\"";
        }

        private readonly object?[] data;
        private readonly string[] properties;
        private readonly Func<object?, object?>[] getters;
    }
}