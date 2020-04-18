using System;
using System.Collections.Generic;
using System.Linq;

namespace SkbKontur.DbViewer.Helpers
{
    public abstract class BaseCsvWriter
    {
        protected BaseCsvWriter(string[] header)
        {
            Header = header;
        }

        public void AddRow(params string[] fields)
        {
            if (fields.Length != Header.Length)
                throw new InvalidOperationException($"Row contains {fields.Length} elements but csv header contains {Header.Length}");
            InnerAddRow(fields);
        }

        public void AddRow(params (string Column, string Value)[] fields)
        {
            var row = new string[Header.Length];
            foreach (var fieldValue in fields)
                row[HeaderIndex[fieldValue.Column]] = fieldValue.Value;
            AddRow(row);
        }

        private string FormatElement(string element)
        {
            element = element.Replace("\"", "\"\"");
            if (long.TryParse(element, out _) || double.TryParse(element, out _))
                return $"=\"{element}\"";
            return $"\"{element}\"";
        }

        protected string BuildCsvRow(string[] row)
        {
            return string.Join(";", row.Select(FormatElement));
        }

        protected string[] Header { get; }

        private Dictionary<string, int> HeaderIndex => Header.Select((name, i) => (Name : name, Index : i))
                                                             .ToDictionary(key => key.Name, key => key.Index);

        protected abstract void InnerAddRow(string[] fields);
    }
}