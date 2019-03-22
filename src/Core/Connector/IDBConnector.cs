using System.Threading.Tasks;

using Kontur.DBViewer.Core.DTO;

namespace Kontur.DBViewer.Core.Connector
{
    public interface IDBConnector
    {
        Task<object[]> Search(Filter[] filters, Sort[] sorts, int from, int count);
        Task<int?> Count(Filter[] filters, int? limit);
        Task<object> Read(Filter[] filters);
        Task Delete(object @object);
        Task<object> Write(object @object);
    }

    public interface IDBConnector<T> : IDBConnector
        where T : class
    {
    }
}