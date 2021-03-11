# db-viewer

Database Viewer with custom configuration

|              | Build Status
|--------------|:--------------:
| DbViewer | [![NuGet Status](https://img.shields.io/nuget/v/SkbKontur.DbViewer)](https://www.nuget.org/packages/SkbKontur.DbViewer/)
| DbViewer.Cql | [![NuGet Status](https://img.shields.io/nuget/v/SkbKontur.DbViewer.Cql)](https://www.nuget.org/packages/SkbKontur.DbViewer.Cql/)
| DbViewer.EntityFramework | [![NuGet Status](https://img.shields.io/nuget/v/SkbKontur.DbViewer.EntityFramework)](https://www.nuget.org/packages/SkbKontur.DbViewer.EntityFramework/)
| db-viewer-ui | [![npm](https://img.shields.io/npm/v/@skbkontur/db-viewer-ui)](https://www.npmjs.com/package/@skbkontur/db-viewer-ui/)
| Build | [![Build status](https://ci.appveyor.com/api/projects/status/jedtsmk59s4oaivm/branch/master?svg=true)](https://ci.appveyor.com/project/skbkontur/db-viewer/branch/master)

## Release Notes

See [CHANGELOG](CHANGELOG.md).

## How to Use

See [ApiController](https://github.com/skbkontur/db-viewer/blob/master/DbViewer.TestApi/Controllers/DbViewerApiController.cs) example for backend configuration.

See [DbViewerApplication](https://github.com/skbkontur/db-viewer/blob/master/db-viewer-ui/index.tsx) usage example for front configuration.

## How to Start

```
# needed for browser tests
docker pull selenoid/vnc:chrome_84.0

# start databases
docker-compose up -d

# build backend
dotnet tool restore
dotnet build --configuration Release ./DbViewer.sln

# build front
yarn install
yarn build:types

# apply db migration
dotnet ef database update --project ./DbViewer.TestApi/DbViewer.TestApi.csproj --no-build --configuration Release

# start db-viewer
./DbViewer.TestApi/bin/net5.0/SkbKontur.DbViewer.TestApi.exe
yarn start:prod

# start tests
dotnet test --no-build --configuration Release ./DbViewer.Tests/DbViewer.Tests.csproj

# run code cleanup
dotnet jb cleanupcode DbViewer.sln --profile=CatalogueCleanup --exclude=./DbViewer.TestApi/Migrations/*.cs --verbosity=WARN
yarn lint
```