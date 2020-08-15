using System;
using System.Drawing;

using NUnit.Framework;

using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Remote;

namespace SkbKontur.DbViewer.Tests.FrontTests.Helpers
{
    public class BrowserForTests : IDisposable
    {
        public void Dispose()
        {
            WebDriver.Dispose();
        }

        public T SwitchTo<T>()
        {
            throw new NotImplementedException();
        }

        private RemoteWebDriver WebDriver
        {
            get
            {
                if (webDriver != null) return webDriver;

                var wdHub = "http://localhost:4444/wd/hub";
                ChromeOptions options = new ChromeOptions();

                options.AddAdditionalCapability(CapabilityType.Platform, "Windows 10", true);
                options.AddAdditionalCapability("name", TestContext.CurrentContext.Test.Name, true);
                options.AddAdditionalCapability("maxDuration", 10800, true);

                webDriver = new RemoteWebDriver(new Uri(wdHub), options.ToCapabilities(), TimeSpan.FromMinutes(5));
                webDriver.Manage().Window.Size = new Size(1280, 1024);
                return webDriver;
            }
        }

        private RemoteWebDriver webDriver;
    }
}