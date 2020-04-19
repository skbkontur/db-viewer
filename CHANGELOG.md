# Changelog

## v0.2.54 - 2020.04.19
- Update db-viewer-ui, publish `@skbkontur/db-viewer-ui` package.
- Use ESLint instead of TSLint.
- Set TargetFramework to netstandard2.0.
- Use [Nerdbank.GitVersioning](https://github.com/dotnet/Nerdbank.GitVersioning) to automate generation of assembly and nuget package versions.
- Use [SourceLink](https://github.com/dotnet/sourcelink) to help ReSharper decompiler show actual code.
- Use C# 8 Nullable Reference Types instead of JetBrains.Annotations.
- Use [TypeScript.ContractGenerator.Cli](https://www.nuget.org/packages/SkbKontur.TypeScript.ContractGenerator.Cli) dotnet tool to build front types.
- Add `AllowDelete` & `AllowEdit` fields to SchemaDescription.
- Add ability to download objects in csv format.
