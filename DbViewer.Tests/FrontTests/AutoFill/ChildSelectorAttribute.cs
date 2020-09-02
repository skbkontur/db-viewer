using System;

using SKBKontur.SeleniumTesting;

namespace SkbKontur.DbViewer.Tests.FrontTests.AutoFill
{
    public class ChildSelectorAttribute : Attribute
    {
        public ChildSelectorAttribute(string selector)
        {
            Selector = new UniversalSelector(selector);
        }

        public ISelector Selector { get; private set; }
    }
}