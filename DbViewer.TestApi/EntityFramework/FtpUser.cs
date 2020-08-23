using System;

using SkbKontur.DbViewer.TestApi.Impl.Attributes;

namespace SkbKontur.DbViewer.TestApi.EntityFramework
{
    public class FtpUser
    {
        [Identity]
        public Guid Id { get; set; }

        [Indexed]
        public string Login { get; set; }

        public string BoxId { get; set; }
    }
}