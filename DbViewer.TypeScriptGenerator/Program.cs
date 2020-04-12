using System;
using System.IO;

using SkbKontur.TypeScript.ContractGenerator;
using SkbKontur.TypeScript.ContractGenerator.CodeDom;

using CustomTypeGenerator = SkbKontur.DbViewer.TypeScriptGenerator.CustomTypeGenerator;

namespace SkbKontur.DbViewer.TypeScriptGenerator
{
    public static class Program
    {
        public static void Main(string[] args)
        {
            GenerateEdiTypes();
        }

        private static void GenerateEdiTypes()
        {
            var targetPath = Path.Combine(Directory.GetParent(AppDomain.CurrentDomain.BaseDirectory).FullName, "../../../../db-viewer-ui/src/Domain/Api");
            if (!Directory.Exists(targetPath))
                Directory.CreateDirectory(targetPath);

            var customTypeGenerator = new CustomTypeGenerator();
            var typeScriptCodeGenerator = new TypeScript.ContractGenerator.TypeScriptGenerator(
                new TypeScriptGenerationOptions
                    {
                        EnableExplicitNullability = true,
                        EnableOptionalProperties = true,
                        UseGlobalNullable = false,
                        LinterDisableMode = LinterDisableMode.EsLint,
                        EnumGenerationMode = EnumGenerationMode.TypeScriptEnum,
                    },
                customTypeGenerator,
                new RootTypesProvider(typeof(DbViewerApi))
            );
            typeScriptCodeGenerator.GenerateFiles(targetPath, JavaScriptTypeChecker.TypeScript);

            foreach (var file in Directory.EnumerateFiles(targetPath, "*.ts", SearchOption.AllDirectories))
            {
                var code = File.ReadAllText(file);
                if (code.StartsWith("// eslint-disable"))
                    File.WriteAllText(file, code.Replace("// eslint-disable", "/* eslint-disable */"));
            }
        }
    }
}