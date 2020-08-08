using System.IO;
using System.Linq;
using System.Reflection;

using GroboContainer.Core;
using GroboContainer.Impl;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Controllers;

namespace SkbKontur.DbViewer.TestApi
{
    public class GroboControllerFactory : IControllerFactory
    {
        public GroboControllerFactory()
        {
            var entryAssembly = Assembly.GetEntryAssembly().Location;
            var assemblies = Directory.EnumerateFiles(Path.GetDirectoryName(entryAssembly), "*.dll", SearchOption.TopDirectoryOnly)
                                      .Where(x => Path.GetFileName(x).StartsWith("SkbKontur.DbViewer"))
                                      .Select(Assembly.LoadFrom);
            groboContainer = new Container(new ContainerConfiguration(assemblies));
        }

        public object CreateController(ControllerContext controllerContext)
        {
            var controllerType = controllerContext.ActionDescriptor.ControllerTypeInfo.AsType();
            var controller = groboContainer.Create(controllerType);
            ((ControllerBase)controller).ControllerContext = controllerContext;
            return controller;
        }

        public void ReleaseController(ControllerContext context, object controller)
        {
        }

        private readonly IContainer groboContainer;
    }
}