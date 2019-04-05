using System;

namespace Kontur.DBViewer.SampleApi.Impl.Attributes
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