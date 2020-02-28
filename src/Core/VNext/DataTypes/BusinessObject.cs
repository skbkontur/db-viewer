using System;

namespace Kontur.DBViewer.Core.VNext.DataTypes
{
    public class BusinessObject : IBusinessObject
    {
        public string Id { get; set; }
        public string ScopeId { get; set; }
        public DateTime? LastModificationDateTime { get; set; }
    }
}