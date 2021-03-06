﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using SkbKontur.DbViewer.TestApi.EntityFramework;
using SkbKontur.DbViewer.TestApi.Impl.Document;

namespace SkbKontur.DbViewer.TestApi.Migrations
{
    [DbContext(typeof(EntityFrameworkDbContext))]
    partial class EntityFrameworkDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn)
                .HasAnnotation("ProductVersion", "3.1.7")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            modelBuilder.Entity("SkbKontur.DbViewer.TestApi.EntityFramework.FtpUser", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("BoxId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Login")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("Login");

                    b.ToTable("FtpUsers");
                });

            modelBuilder.Entity("SkbKontur.DbViewer.TestApi.EntityFramework.SqlDocument", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<DocumentContent>("DocumentContent")
                        .IsRequired()
                        .HasColumnType("jsonb");

                    b.Property<DateTimeOffset>("DocumentDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("DocumentNumber")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<decimal>("DocumentPrice")
                        .HasColumnType("numeric");

                    b.Property<int>("DocumentType")
                        .HasColumnType("integer");

                    b.Property<bool>("IsLargeDocument")
                        .HasColumnType("boolean");

                    b.Property<int>("ShardNumber")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.ToTable("Documents");
                });

            modelBuilder.Entity("SkbKontur.DbViewer.TestApi.EntityFramework.TestTable", b =>
                {
                    b.Property<int>("Id")
                        .HasColumnType("integer");

                    b.Property<string>("CompositeKey")
                        .HasColumnType("text");

                    b.Property<bool>("Boolean")
                        .HasColumnType("boolean");

                    b.Property<Customer>("Customer")
                        .IsRequired()
                        .HasColumnType("jsonb");

                    b.Property<byte[]>("CustomerSerialized")
                        .IsRequired()
                        .HasColumnType("bytea");

                    b.Property<DateTime>("DateTime")
                        .HasColumnType("timestamp without time zone");

                    b.Property<DateTimeOffset>("DateTimeOffset")
                        .HasColumnType("timestamp with time zone");

                    b.Property<int>("Integer")
                        .HasColumnType("integer");

                    b.Property<string>("String")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id", "CompositeKey");

                    b.HasIndex("Boolean", "Integer", "String", "DateTime", "DateTimeOffset");

                    b.ToTable("Tests");
                });

            modelBuilder.Entity("SkbKontur.DbViewer.TestApi.EntityFramework.UsersTable", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<bool>("IsSuperUser")
                        .HasColumnType("boolean");

                    b.Property<DateTime>("LastModificationDateTime")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("Patronymic")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("ScopeId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Surname")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("ScopeId");

                    b.ToTable("Users");
                });
#pragma warning restore 612, 618
        }
    }
}
