using System;

namespace SkbKontur.DbViewer.Tests.FrontTests.Helpers
{
    [AttributeUsage(AttributeTargets.Class, AllowMultiple = true, Inherited = false)]
    public class PageRouteAttribute : Attribute
    {
        public PageRouteAttribute(string route)
        {
            Route = route;
        }

        public string Route { get; }
    }
}