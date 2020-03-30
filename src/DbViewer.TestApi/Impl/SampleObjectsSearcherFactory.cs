using SkbKontur.DbViewer.Connector;

namespace SkbKontur.DbViewer.TestApi.Impl
{
    public class SampleIdbConnectorFactory : IDbConnectorFactory
    {
        public IDbConnector CreateConnector<T>()
            where T : class
        {
            return new SampleDBConnector<T>();
        }
    }
}