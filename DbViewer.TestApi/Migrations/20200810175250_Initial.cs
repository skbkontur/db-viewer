using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using SkbKontur.DbViewer.TestApi.EntityFramework;

namespace SkbKontur.DbViewer.TestApi.Migrations
{
    public partial class Initial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Tests",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false),
                    CompositeKey = table.Column<string>(nullable: false),
                    Boolean = table.Column<bool>(nullable: false),
                    Integer = table.Column<int>(nullable: false),
                    String = table.Column<string>(nullable: false),
                    DateTime = table.Column<DateTime>(nullable: false),
                    DateTimeOffset = table.Column<DateTimeOffset>(nullable: false),
                    Customer = table.Column<Customer>(type: "jsonb", nullable: false),
                    CustomerSerialized = table.Column<byte[]>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tests", x => new { x.Id, x.CompositeKey });
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Email = table.Column<string>(nullable: false),
                    Name = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Tests_Boolean_Integer_String_DateTime_DateTimeOffset",
                table: "Tests",
                columns: new[] { "Boolean", "Integer", "String", "DateTime", "DateTimeOffset" });

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Tests");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
