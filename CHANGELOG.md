# Changelog

## v0.2.x - 2020.04.30
- Allow sort by multiple columns.
- Mark `CqlPagedDbConnector` as obsolete since it does not work properly.

## v0.2.70 - 2020.04.29
- Move `@skbkontur/react-ui` & `@skbkontur/react-icons` to peerDependencies.
- Update front dependencies.
- Fix DateTimeTicks input.
- Remove invalid characters validation in filters.
- Use svg in not found page.
- Add Cql connector which read all entries with limit.
- Use client side paging when `IDbConnector.Count` method returns `null`.
- Allow download first `DownloadLimit` objects when `IDbConnector.Count` method returns `null`.

## v0.2.61 - 2020.04.27
- Fix db-viewer-ui compilation to es5.

## v0.2.59 - 2020.04.22
- Fix json serializer configuration.
- Disallow editing for complex properties and properties without setter.
- Fix complex object inside array conversion to api.
- Fix Cql count query.

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
