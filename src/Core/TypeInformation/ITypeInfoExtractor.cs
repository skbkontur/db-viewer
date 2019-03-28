using System;

namespace Kontur.DBViewer.Core.TypeInformation
{
    public interface ITypeInfoExtractor
    {
        TypeInfo Extract(Type type);
    }
}