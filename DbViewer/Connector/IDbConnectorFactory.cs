namespace SkbKontur.DbViewer.Connector
{
    public interface IDbConnectorFactory
    {
        IDbConnector CreateConnector<T>() where T : class;
    }
}