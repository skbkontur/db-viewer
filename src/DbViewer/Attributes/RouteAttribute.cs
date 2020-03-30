using System;

namespace SkbKontur.DbViewer.Attributes
{
    internal class RouteAttribute : Attribute
    {
        public RouteAttribute(string template)
        {
            Template = template;
        }

        public string Template { get; }
    }
}