using Kontur.DBViewer.Core.TypeInformation;

namespace Kontur.DBViewer.Core.DTO
{
    public class ObjectDetailsModel
    {
        public object Object { get; set; }
        public FieldInfo TypeInfo { get; set; }
    }
}