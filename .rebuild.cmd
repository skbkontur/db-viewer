dotnet build --force --no-incremental --configuration Release ./DbViewer.sln

REM dotnet tool restore
REM dotnet ts-gen ^
REM     --assembly ./DbViewer.TestApi/bin/Release/net472/SkbKontur.DbViewer.TestApi.exe ^
REM     --outputDir ./db-viewer-ui/src/Domain/Api ^
REM     --nullabilityMode NullableReference

"./DbViewer.TypeScriptGenerator/bin/Release/net472/SkbKontur.DbViewer.TypeScriptGenerator.exe" 

pause
