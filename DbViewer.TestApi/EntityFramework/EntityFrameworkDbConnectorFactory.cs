using System;

using SkbKontur.DbViewer.Connector;
using SkbKontur.DbViewer.EntityFramework;

namespace SkbKontur.DbViewer.TestApi.EntityFramework
{
    public class EntityFrameworkDbConnectorFactory : IDbConnectorFactory
    {
        public EntityFrameworkDbConnectorFactory(Func<EntityFrameworkDbContext> createContext)
        {
            this.createContext = createContext;
        }

        public IDbConnector CreateConnector<T>() where T : class
        {
            return new EntityFrameworkDbConnector<T>(createContext);
        }

        private readonly Func<EntityFrameworkDbContext> createContext;
    }
}