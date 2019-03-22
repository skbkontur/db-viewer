using System;

using Kontur.DBViewer.Core.TypeInformation;

namespace Kontur.DBViewer.Core.Connector
{
    public interface ITypeInfoExtractor
    {
        FieldInfo GetShape(Type type);
    }
}