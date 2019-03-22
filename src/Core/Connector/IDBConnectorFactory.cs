namespace Kontur.DBViewer.Core.Connector
{
    public interface IDBConnectorFactory
    {
        IDBConnector CreateConnector<T>() where T : class;
    }
}