using System;
using System.Collections.Generic;
using System.Linq;

using FluentAssertions;

using Kontur.RetryableAssertions.Configuration;
using Kontur.RetryableAssertions.ValueProviding;
using Kontur.Selone.Properties;

using NUnit.Framework;
using NUnit.Framework.Constraints;
using NUnit.Framework.Internal;

using OpenQA.Selenium;

using SKBKontur.SeleniumTesting;
using SKBKontur.SeleniumTesting.Controls;

namespace SkbKontur.DbViewer.Tests.FrontTests.Helpers
{
    public static class AssertionExtensions
    {
        public static void WaitText(this Label compoundControl, string text)
        {
            compoundControl.Text.Wait().That(Is.EqualTo(text));
        }

        public static void WaitText(this Link compoundControl, string text)
        {
            compoundControl.Text.Wait().That(Is.EqualTo(text));
        }

        public static void WaitCount<T>(this ControlListBase<T> controlList, int count)
            where T : ControlBase
        {
            controlList.Count.Wait().That(Is.EqualTo(count));
        }

        public static IValueProvider<TResult[], TResult[]> Wait<T, TResult>(this ControlListBase<T> list, Func<T, IProp<TResult>> func)
            where T : ControlBase
        {
            return ValueProvider.Create(() => list.Select(x => func(x).Get()).ToArray());
        }

        public static T GetItemWithText<T>(this ControlListBase<T> list, Func<T, IProp<string>> f, string text)
            where T : ControlBase
        {
            return list.GetItemThat(x => f(x).Get().Should().Be(text));
        }

        public static IValueProvider<T, T> Wait<T>(this IProp<T> property)
        {
            return ValueProvider.Create(property.Get, property.GetDescription);
        }

        public static IValueProvider<T[], T[]> Wait<T>(this IEnumerable<IProp<T>> properties)
        {
            return ValueProvider.Create(() => properties.Select(x => x.Get()).ToArray(), string.Join("\n", properties.Select(x => x.GetDescription())));
        }

        public static void That<T, TSource>(this IValueProvider<T, TSource> provider, IResolveConstraint constraint, string failMessage = "")
        {
            var reusableConstraint = new ReusableConstraint(constraint);
            var assertion = Assertion.FromDelegate<T>(x =>
                {
                    using (new TestExecutionContext.IsolatedContext())
                    {
                        Assert.That(x, reusableConstraint, message : failMessage);
                    }
                });
            Kontur.RetryableAssertions.Wait.Assertion(provider, new AssertionConfiguration<T>
                {
                    Timeout = 20_000,
                    Interval = 100,
                    Assertion = assertion,
                    ExceptionMatcher = exceptionMatcher,
                });
        }

        private static readonly IExceptionMatcher exceptionMatcher = ExceptionMatcher.FromTypes(typeof(WebDriverException), typeof(InvalidOperationException), typeof(ElementNotFoundException));
    }
}