using System;

namespace Kontur.DBViewer.Tests.TypeInfoExtractor
{
    public class SerializedAttribute : Attribute
    {
        public Type Type { get; }

        public SerializedAttribute(Type type)
        {
            Type = type;
        }
    }
}