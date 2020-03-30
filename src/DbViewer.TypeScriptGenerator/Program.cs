using System;
using System.IO;

using SkbKontur.DbViewer.VNext;
using SkbKontur.TypeScript.ContractGenerator;
using SkbKontur.TypeScript.ContractGenerator.CodeDom;

using CustomTypeGenerator = SkbKontur.DbViewer.TypeScriptGenerator.Customization.CustomTypeGenerator;

namespace SkbKontur.DbViewer.TypeScriptGenerator
{
    public static class Program
    {
        public static void Main(string[] args)
        {
            GenerateDbViewerTypes();
            GenerateEdiTypes();
        }

        private static void GenerateDbViewerTypes()
        {
            var targetPath = Path.Combine(Directory.GetParent(AppDomain.CurrentDomain.BaseDirectory).FullName, "..",
                                          "..", "Front", "src", "api", "impl");

            var customTypeGenerator = new CustomTypeGenerator();
            var typeScriptCodeGenerator = new TypeScript.ContractGenerator.TypeScriptGenerator(
                new TypeScriptGenerationOptions
                    {
                        EnableExplicitNullability = true,
                        EnableOptionalProperties = false,
                        EnumGenerationMode = EnumGenerationMode.TypeScriptEnum,
                        UseGlobalNullable = true,
                    },
                customTypeGenerator,
                new RootTypesProvider(typeof(DbViewerControllerImpl))
            );
            typeScriptCodeGenerator.GenerateFiles(targetPath, JavaScriptTypeChecker.TypeScript);
        }

        private static void GenerateEdiTypes()
        {
            var targetPath = Path.Combine(Directory.GetParent(AppDomain.CurrentDomain.BaseDirectory).FullName, "..",
                                          "..", @"FrontClientApps\src\Domain\Api");

            var customTypeGenerator = new CustomTypeGenerator();
            var typeScriptCodeGenerator = new TypeScript.ContractGenerator.TypeScriptGenerator(
                new TypeScriptGenerationOptions
                    {
                        EnableExplicitNullability = true,
                        EnableOptionalProperties = true,
                        UseGlobalNullable = false,
                        EnumGenerationMode = EnumGenerationMode.TypeScriptEnum,
                    },
                customTypeGenerator,
                new RootTypesProvider(typeof(DbViewerApi))
            );
            typeScriptCodeGenerator.GenerateFiles(targetPath, JavaScriptTypeChecker.TypeScript);
        }
    }
}