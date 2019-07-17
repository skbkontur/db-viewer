using Kontur.DBViewer.Core.Connector;
using Kontur.DBViewer.SampleApi.Impl.Utils;

namespace Kontur.DBViewer.SampleApi.Controllers
{
    public class CqlDbConnectorFactory : IDBConnectorFactory
    {
        public IDBConnector CreateConnector<T>() where T : class
        {
            return new CqlDatabaseConnector<T>();
        }
    }
}