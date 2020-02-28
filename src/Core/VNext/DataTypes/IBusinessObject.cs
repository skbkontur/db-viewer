using System;

namespace Kontur.DBViewer.Core.VNext.DataTypes
{
    public interface IBusinessObject : IEntity
    {
        string ScopeId { get; set; }
        DateTime? LastModificationDateTime { get; set; }
    }
}