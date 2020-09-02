using Kontur.Selone.Properties;

using NUnit.Framework;

using SKBKontur.SeleniumTesting;

namespace SkbKontur.DbViewer.Tests.FrontTests.Helpers
{
    public static class ControlBaseExtensions
    {
        public static void WaitPresence(this ControlBase control)
        {
            control.IsPresent.Wait().That(Is.True);
        }

        public static void WaitAbsence(this ControlBase control)
        {
            control.IsPresent.Wait().That(Is.False);
        }

        public static void WaitIncorrect(this ControlBase control)
        {
            control.GetError().Wait().That(Is.True);
        }

        public static void WaitCorrect(this ControlBase control)
        {
            control.GetError().Wait().That(Is.False);
        }

        public static T ClickAndGoTo<T>(this ControlBase control)
            where T : PageBase
        {
            return control.ClickAndGetPage().GoTo<T>();
        }

        private static PageBase ClickAndGetPage(this ControlBase control)
        {
            control.Click();
            return (PageBase)control.GetRootContainer();
        }

        private static IProp<bool> GetError(this ControlBase control)
        {
            return Prop.Create(control.HasError, "error");
        }
    }
}