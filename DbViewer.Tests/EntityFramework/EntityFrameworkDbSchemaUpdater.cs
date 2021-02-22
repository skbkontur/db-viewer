using System;
using System.Threading.Tasks;

using GroBuf;
using GroBuf.DataMembersExtracters;

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
            var serializer = new Serializer(new AllPropertiesExtractor());
            var customer = new Customer
                {
                    Age = 1,
                    Name = "qwer",
                    Orders = new[]
                        {
                            new Order {Price = 3, ShippingAddress = "4"},
                            new Order {Price = 1, ShippingAddress = "2"},
                        }
                };

            await using var context = new EntityFrameworkDbContext();
            await context.Set<TestTable>().AddAsync(new TestTable
                {
                    Id = 1,
                    CompositeKey = "2",
                    Boolean = false,
                    Integer = 1345,
                    String = "qwerty",
                    DateTime = DateTime.Today,
                    DateTimeOffset = DateTimeOffset.UtcNow,
                    Customer = customer,
                    CustomerSerialized = serializer.Serialize(customer),
                });

            await context.Set<UsersTable>().AddAsync(new UsersTable
                {
                    Id = Guid.NewGuid(),
                    ScopeId = "2",
                    FirstName = "3",
                });

            await context.SaveChangesAsync();
        }
    }
}