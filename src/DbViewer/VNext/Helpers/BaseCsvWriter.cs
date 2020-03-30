using System;
using System.Collections.Generic;
using System.Linq;

namespace SkbKontur.DbViewer.VNext.Helpers
{
    public abstract class BaseCsvWriter
    {
        protected BaseCsvWriter([NotNull, ItemNotNull] string[] header)
        {
            Header = header;
        }

        public void AddRow([NotNull] params string[] fields)
        {
            if (fields.Length != Header.Length)
                throw new InvalidOperationException(
                    $"Row contains {fields.Length} elements but csv header contains {Header.Length}");
            InnerAddRow(fields);
        }

        public void AddRow([NotNull] params (string Column, string Value)[] fields)
        {
            var row = new string[Header.Length];
            foreach (var fieldValue in fields)
                row[HeaderIndex[fieldValue.Column]] = fieldValue.Value;
            AddRow(row);
        }

        [NotNull]
        private string FormatElement(string element)
        {
            element = element.Replace("\"", "\"\"");
            if (long.TryParse(element, out _) || double.TryParse(element, out _))
                return $"=\"{element}\"";
            return $"\"{element}\"";
        }

        [NotNull]
        protected string BuildCsvRow([NotNull, ItemNotNull] string[] row)
        {
            return string.Join(";", row.Select(FormatElement));
        }

        [NotNull, ItemNotNull]
        protected string[] Header { get; }

        [NotNull]
        private Dictionary<string, int> HeaderIndex => Header.Select((name, i) => (Name : name, Index : i))
                                                             .ToDictionary(key => key.Name, key => key.Index);

        protected abstract void InnerAddRow([NotNull] string[] fields);
    }
}