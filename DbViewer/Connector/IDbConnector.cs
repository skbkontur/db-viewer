using System.Threading.Tasks;

using SkbKontur.DbViewer.DataTypes;

namespace SkbKontur.DbViewer.Connector
{
    public interface IDbConnector
    {
        Task<object[]> Search(Condition[] filters, Sort[] sorts, int from, int count);
        Task<int?> Count(Condition[] filters, int limit);
        Task<object?> Read(Condition[] filters);
        Task Delete(Condition[] filters);
        Task Write(object @object);
    }

    public interface IDbConnector<T> : IDbConnector
        where T : class
    {
    }
}