using System;

namespace SkbKontur.DbViewer.Tests.FrontTests.AutoFill
{
    public class SelectorAttribute : Attribute
    {
        public SelectorAttribute(string selector)
        {
            Selector = selector;
        }

        public string Selector { get; }
    }
}