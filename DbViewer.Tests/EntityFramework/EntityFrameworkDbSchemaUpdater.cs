using System.Threading.Tasks;

using Microsoft.EntityFrameworkCore;

using NUnit.Framework;

using SkbKontur.DbViewer.TestApi.EntityFramework;

namespace SkbKontur.DbViewer.Tests.EntityFramework
{
    public class EntityFrameworkDbSchemaUpdater
    {
        [Test]
        [Explicit]
        public async Task Test()
        {
            await using var context = new EntityFrameworkDbContext();
            await CreateTable<TestTable>(context, 100).ConfigureAwait(false);
            await CreateTable<UsersTable>(context, 1000).ConfigureAwait(false);
        }

        private static async Task CreateTable<T>(DbContext context, int count)
            where T : class
        {
            var table = context.Set<T>();
            await table.AddRangeAsync();
            // await table.AddAsync().ConfigureAwait(false)
            // session.Execute($"DROP TABLE IF EXISTS {table.KeyspaceName}.{table.Name};");
            // table.CreateIfNotExists();

            // var fixture = new Fixture();
            // fixture.Register((DateTime dt) => dt.ToLocalDate());
            // fixture.Register((DateTime dt) => CassandraPrimitivesExtensions.ToLocalTime(dt));

            // for (var i = 0; i < count; i++)
            // table.Insert(fixture.Create<T>()).SetTimestamp(DateTimeOffset.UtcNow).Execute();
        }
    }
}