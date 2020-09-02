using System;

using SKBKontur.SeleniumTesting;

namespace SkbKontur.DbViewer.Tests.FrontTests.AutoFill
{
    public class SelectorAttribute : Attribute
    {
        public SelectorAttribute(string selector)
        {
            Selector = new UniversalSelector(selector);
        }

        public ISelector Selector { get; private set; }
    }
}