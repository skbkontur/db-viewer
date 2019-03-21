using System;
using System.IO;
using Kontur.DBViewer.Core;
using SkbKontur.TypeScript.ContractGenerator;
using SkbKontur.TypeScript.ContractGenerator.CodeDom;
using CustomTypeGenerator = Kontur.DBViewer.TypeScriptGenerator.Customization.CustomTypeGenerator;

namespace Kontur.DBViewer.TypeScriptGenerator
{
    class Program
    {
        static void Main(string[] args)
        {
            var targetPath = Path.Combine(Directory.GetParent(AppDomain.CurrentDomain.BaseDirectory).FullName, "..", "..", "Front", "src", "api", "impl");

            var customTypeGenerator = new CustomTypeGenerator();
            var typeScriptCodeGenerator = new SkbKontur.TypeScript.ContractGenerator.TypeScriptGenerator(
                new TypeScriptGenerationOptions
                {
                    EnableExplicitNullability = true,
                    EnableOptionalProperties = false,
                    EnumGenerationMode = EnumGenerationMode.TypeScriptEnum,
                    UseGlobalNullable = true,
                }, 
                customTypeGenerator,
                new RootTypesProvider(typeof(DBViewerControllerImpl))
            );
            typeScriptCodeGenerator.GenerateFiles(targetPath, JavaScriptTypeChecker.TypeScript);
        }
    }
}