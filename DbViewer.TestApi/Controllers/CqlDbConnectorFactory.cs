using SkbKontur.DbViewer.Connector;
using SkbKontur.DbViewer.TestApi.Impl;

namespace SkbKontur.DbViewer.TestApi.Controllers
{
    public class CqlDbConnectorFactory : IDbConnectorFactory
    {
        public IDbConnector CreateConnector<T>() where T : class
        {
            return new CqlDatabaseConnector<T>();
        }
    }
}