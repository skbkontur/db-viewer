using System;
using Microsoft.EntityFrameworkCore.Migrations;
using SkbKontur.DbViewer.TestApi.EntityFramework;
using SkbKontur.DbViewer.TestApi.Impl.Document;

namespace SkbKontur.DbViewer.TestApi.Migrations
{
    public partial class Initial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Documents",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    DocumentNumber = table.Column<string>(nullable: false),
                    DocumentDate = table.Column<DateTimeOffset>(nullable: false),
                    DocumentType = table.Column<int>(nullable: false),
                    IsLargeDocument = table.Column<bool>(nullable: false),
                    ShardNumber = table.Column<int>(nullable: false),
                    DocumentPrice = table.Column<decimal>(nullable: false),
                    DocumentContent = table.Column<DocumentContent>(type: "jsonb", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Documents", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "FtpUsers",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Login = table.Column<string>(nullable: false),
                    BoxId = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FtpUsers", x => x.Id);
                });

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
                    Id = table.Column<Guid>(nullable: false),
                    ScopeId = table.Column<string>(nullable: false),
                    LastModificationDateTime = table.Column<DateTime>(nullable: false),
                    Email = table.Column<string>(nullable: false),
                    FirstName = table.Column<string>(nullable: false),
                    Surname = table.Column<string>(nullable: false),
                    Patronymic = table.Column<string>(nullable: false),
                    IsSuperUser = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FtpUsers_Login",
                table: "FtpUsers",
                column: "Login");

            migrationBuilder.CreateIndex(
                name: "IX_Tests_Boolean_Integer_String_DateTime_DateTimeOffset",
                table: "Tests",
                columns: new[] { "Boolean", "Integer", "String", "DateTime", "DateTimeOffset" });

            migrationBuilder.CreateIndex(
                name: "IX_Users_ScopeId",
                table: "Users",
                column: "ScopeId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Documents");

            migrationBuilder.DropTable(
                name: "FtpUsers");

            migrationBuilder.DropTable(
                name: "Tests");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
