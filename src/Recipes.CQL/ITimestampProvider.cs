using System;
using System.Threading.Tasks;

namespace Kontur.DBViewer.Recipes.CQL
{
    public interface ITimestampProvider
    {
        Task<DateTimeOffset> GetTimestamp(string tableName);
    }
}