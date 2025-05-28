# Changelog

## v1.10 - 2025.05.28
- Update react-ui
- Update edi-ui

## v1.9 - 2025.01.27
- Follow and processing the status of the redirect code (302) for the fetch method

## v1.8 - 2024.05.21
- Update react-ui
- Add mini modals

## v1.7 - 2023.11.22
- Update yarn to v4
- Update node to v20
- Fix build error

## v1.6 - 2023.10.13
- Update yarn to v3
- Change webpack to vite
- Add js tests
- Update chrome to v112

## v1.5 - 2023.08.16
- Redesign back link arrows 
- Update dotnet and selenoid
- Header is now responsive

## v1.4 - 2023.05.05
- Update "react-router-dom" package to v6

## v1.3 - 2023.03.26
- Remove `qs` and `decimal.js` packages, change query string format
- Switch to using github-actions
- Change layout paddings and GoBack button

## v1.2.39 - 2022.09.07
- Replace `moment.js` with `date-fns`
- Edit DateTime and DateTimeOffset without change of time zone when it's possible
- Select DateTimeKind for DateTime

## v1.2.33 - 2022.06.15
- Update `@skbkontur/react-ui` package

## v1.2.20 - 2021.08.19
- Fix front dependencies

## v1.2.18 - 2021.08.17
- Fix bug with filtering when not in first page

## v1.2.3 - 2021.05.31
- Add support for dark theme using react-ui ThemeContext
- Update supported peerDependencies versions range

## v1.1.17 - 2021.03.11
- fix field selector filter

## v1.1.11 - 2021.02.25
- Update `@skbkontur/react-ui` package
- Remove deprecated react lifecycle methods

## v1.0.18 - 2021.01.25
- Remove `sep=;` from downloaded csv since it [breaks encoding parsing](https://stackoverflow.com/questions/20395699/sep-statement-breaks-utf8-bom-in-csv-file-which-is-generated-by-xsl)

## v1.0.16 - 2021.01.21
- Use DownloadFileStream to be more memory efficient when downloading large files

## v1.0.4 - 2020.10.13
- Explicitly allow sorting in SchemaDescription
- Add validations to DbViewerApi methods

## v1.0.1 - 2020.09.16
- Type captions in Object viewer can be copied
- Fix NotFound page

## v0.2.100 - 2020.08.17
- Add `DbViewer.EntityFramework` package
- Add type information to object details view

## v0.2.83 - 2020.05.06
- Fix for rendering object with Hashtable inside.
- Use non-recursive convert method in `SearchObjects` for better performance with large objects.
- Add `CountLimitForSuperUser` and `DownloadLimitForSuperUser` constants.

## v0.2.78 - 2020.05.01
- Fix server side paging.

## v0.2.76 - 2020.04.30
- Display TypeIdentifier instead of type name in types list.

## v0.2.74 - 2020.04.30
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
