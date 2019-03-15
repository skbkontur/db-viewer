using System;

using Kontur.DBViewer.Core.TypeInformation;

namespace Kontur.DBViewer.Core.Searcher
{
    public interface ITypeInfoExtractor
    {
        FieldInfo GetShape(Type type);
    }
}