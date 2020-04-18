using System;
using System.IO;

using SkbKontur.DbViewer.TestApi.TypeScriptConfiguration;
using SkbKontur.TypeScript.ContractGenerator;

namespace SkbKontur.DbViewer.TypeScriptGenerator
{
    public static class Program
    {
        public static void Main(string[] args)
        {
            var targetPath = Path.Combine(Directory.GetParent(AppDomain.CurrentDomain.BaseDirectory).FullName, "../../../../db-viewer-ui/src/Domain/Api");
            if (!Directory.Exists(targetPath))
                Directory.CreateDirectory(targetPath);

            var typeScriptCodeGenerator = new TypeScript.ContractGenerator.TypeScriptGenerator(
                new TypeScriptGenerationOptions
                    {
                        EnableExplicitNullability = true,
                        EnableOptionalProperties = true,
                        UseGlobalNullable = false,
                        NullabilityMode = NullabilityMode.NullableReference,
                        LinterDisableMode = LinterDisableMode.EsLint,
                    },
                new DbViewerCustomTypeGenerator(),
                new DbViewerTypesProvider());
            typeScriptCodeGenerator.GenerateFiles(targetPath);

            foreach (var file in Directory.EnumerateFiles(targetPath, "*.ts", SearchOption.AllDirectories))
            {
                var code = File.ReadAllText(file);
                if (code.StartsWith("// eslint-disable"))
                    File.WriteAllText(file, code.Replace("// eslint-disable", "/* eslint-disable */"));
            }
        }
    }
}