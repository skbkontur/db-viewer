using System;

using SkbKontur.DbViewer.TestApi.Impl.Attributes;

namespace SkbKontur.DbViewer.TestApi.EntityFramework
{
    public class UsersTable
    {
        [Identity]
        public Guid Id { get; set; }

        [Indexed]
        public string ScopeId { get; set; }

        public DateTime LastModificationDateTime { get; set; }

        public string Email { get; set; }
        public string FirstName { get; set; }
        public string Surname { get; set; }
        public string Patronymic { get; set; }
        public bool IsSuperUser { get; set; }
    }
}