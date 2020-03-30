using System;
using System.Threading.Tasks;

namespace SkbKontur.DbViewer.Cql
{
    public interface ITimestampProvider
    {
        Task<DateTimeOffset> GetTimestamp(string tableName);
    }
}