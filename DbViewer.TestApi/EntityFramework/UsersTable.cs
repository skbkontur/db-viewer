using SkbKontur.DbViewer.TestApi.Impl.Attributes;

namespace SkbKontur.DbViewer.TestApi.EntityFramework
{
    public class UsersTable
    {
        [Identity]
        public int Id { get; set; }

        [Indexed]
        public string Email { get; set; }

        public string Name { get; set; }
    }
}