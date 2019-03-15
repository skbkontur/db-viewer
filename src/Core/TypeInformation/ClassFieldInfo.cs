using System.Collections.Generic;

namespace Kontur.DBViewer.Core.TypeInformation
{
    public class ClassFieldInfo : FieldInfo
    {
        public override FieldType Type => FieldType.Class;
        public Dictionary<string, FieldInfo> Fields { get; set; }
    }
}