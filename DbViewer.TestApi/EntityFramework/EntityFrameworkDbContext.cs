using System;
using System.Linq;
using System.Reflection;

using Microsoft.EntityFrameworkCore;

namespace SkbKontur.DbViewer.TestApi.EntityFramework
{
    public class EntityFrameworkDbContext : DbContext
    {
        public DbSet<UsersTable> Users { get; set; }
        public DbSet<TestTable> Tests { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
            => optionsBuilder.UseNpgsql("Host=localhost;Database=my_db;Username=postgres;Password=postgres");

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            foreach (var type in entityTypes)
            {
                modelBuilder.Entity(type)
                            .ApplyPrimaryKey()
                            .ApplyIndices();
            }
        }

        // todo (p.vostretsov, 08.08.2020): точно получше никак нельзя?
        private static readonly Type[] entityTypes = typeof(EntityFrameworkDbContext)
                                                     .GetProperties(BindingFlags.Public | BindingFlags.Instance)
                                                     .Select(x => x.PropertyType)
                                                     .Where(x => x.IsGenericType && x.GetGenericTypeDefinition() == typeof(DbSet<>))
                                                     .Select(x => x.GetGenericArguments()[0])
                                                     .ToArray();
    }
}