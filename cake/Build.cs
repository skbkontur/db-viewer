using System.IO;

using Alko.CodeCakeWrapper;

using Cake.Common.Tools.NuGet;
using Cake.Core;

namespace cake
{
    class Build : AlkoBuildBase
    {
        public Build()
        {
            var slnName = "DBViewer.sln";
            var srcDirectory = Path.Combine(moduleDirectory, @"src");
            var mainSuite = Path.Combine(moduleDirectory, @"serviceSuites\startAll.yaml");
            var cassandraSuite = Path.Combine(cementDirectory, @"alco.global-services\serviceSuites\cassandra3.yaml");
            var pathToTestsDll = "src/Tests/bin/Kontur.DBViewer.Tests.dll";
            var suites = new[] {mainSuite, cassandraSuite};
            
            var startServices = CakeTask("StartServices").Does(() =>
                {
                    Cake.StartServices(cementDirectory, suites, true);
                });
            var stopServices = CakeTask("StopServices").Does(() =>
                {
                    Cake.StopServices(cementDirectory, suites);
                });

            var restorePackages =
                CakeTask("RestorePackages")
                    .Does(() => { Cake.NuGetRestore(Path.Combine(srcDirectory, slnName)); });

            var startServiceRunner =
                CakeTask("ServiceRunner")
                    .Does(() => { Cake.StartServices(cementDirectory, suites, false); });

            var tests =
                CakeTask("Test", false)
                    .Does(() => { Cake.RunTests(cementDirectory, Path.Combine(moduleDirectory, pathToTestsDll)); });
            
            var tcIntegrationTests = CakeTask("TcTest").Does(() => { })
                                                                   .IsDependentOn(startServices)
                                                                   .IsDependentOn(tests)
                                                                   .Finally(() => stopServices.Task.Execute(Cake).Wait());
            
            PackAndPublishTasks("Core", "Core");
            PackAndPublishTasks("Recipes.CQL", "Recipes.CQL");
        }

        private void PackAndPublishTasks(string taskName, string projectName)
        {
            var packCassandraCommons =
                CakeTask($"Pack{taskName}")
                    .Does(() => { Cake.PackCsproj(GetCsprojPath(projectName)); });

            CakeTask($"Publish{taskName}")
                .IsDependentOn(packCassandraCommons)
                .Does(() => { Cake.PublishProject(GetArtifactsFolderPath(projectName), KonturNugetAddress); });
        }

        private string GetCsprojPath(string projectName)
        {
            return Path.Combine(moduleDirectory, "src", projectName, projectName + ".csproj");
        }

        private string GetArtifactsFolderPath(string projectName)
        {
            return Path.Combine(moduleDirectory, "src", projectName, ".artifacts");
        }
    }
}