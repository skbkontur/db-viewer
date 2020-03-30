using System.Threading.Tasks;

using SkbKontur.DbViewer.Dto;

namespace SkbKontur.DbViewer.Connector
{
    public interface IDbConnector
    {
        Task<object[]> Search(Filter[] filters, Sort[] sorts, int from, int count);
        Task<int?> Count(Filter[] filters, int? limit);
        Task<object> Read(Filter[] filters);
        Task Delete(object @object);
        Task<object> Write(object @object);
    }

    public interface IDbConnector<T> : IDbConnector
        where T : class
    {
    }
}