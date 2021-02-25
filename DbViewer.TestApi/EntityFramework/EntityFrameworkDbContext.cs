using System;
using System.Linq;
using System.Reflection;

using Microsoft.EntityFrameworkCore;

namespace SkbKontur.DbViewer.TestApi.EntityFramework
{
    public class EntityFrameworkDbContext : DbContext
    {
        public DbSet<UsersTable> Users { get; set; }
        public DbSet<FtpUser> FtpUsers { get; set; }
        public DbSet<TestTable> Tests { get; set; }
        public DbSet<SqlDocument> Documents { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
            => optionsBuilder.UseNpgsql("Host=localhost;Database=my_db;Username=postgres;Password=postgres");

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            foreach (var type in EntityTypes)
            {
                modelBuilder.Entity(type)
                            .ApplyPrimaryKey()
                            .ApplyIndices();
            }
        }

        public static readonly Type[] EntityTypes = typeof(EntityFrameworkDbContext)
                                                    .GetProperties(BindingFlags.Public | BindingFlags.Instance)
                                                    .Select(x => x.PropertyType)
                                                    .Where(x => x.IsGenericType && x.GetGenericTypeDefinition() == typeof(DbSet<>))
                                                    .Select(x => x.GetGenericArguments()[0])
                                                    .ToArray();
    }
}