using System;

namespace Kontur.DBViewer.Core.Attributes
{
    internal class RouteAttribute : Attribute
    {
        public RouteAttribute(string template)
        {
            Template = template;
        }

        public string Template { get; set; }
    }
}