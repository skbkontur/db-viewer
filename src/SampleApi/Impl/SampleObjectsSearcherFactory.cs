using Kontur.DBViewer.Core.Connector;

namespace Kontur.DBViewer.SampleApi.Impl
{
    public class SampleIdbConnectorFactory : IDBConnectorFactory
    {
        public IDBConnector CreateConnector<T>()
            where T: class 
        {
            return new SampleDBConnector<T>();
        }
    }
}