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

        public static void WaitText(this CompoundControl compoundControl, string text)
        {
            compoundControl.Text.Wait().That(Is.EqualTo(text));
        }

        public static void WaitText(this Select select, string text)
        {
            select.SelectedValueText.Wait().That(Is.EqualTo(text));
        }

        public static void WaitTextContains(this Label button, params string[] substrings)
        {
            button.Text.Wait().That(ContainsMany(substrings));
        }

        public static void WaitTextContains(this CompoundControl button, params string[] substrings)
        {
            button.Text.Wait().That(ContainsMany(substrings));
        }

        public static void WaitCount<T>(this ControlListBase<T> controlList, int count)
            where T : ControlBase
        {
            controlList.Count.Wait().That(Is.EqualTo(count));
        }

        public static void WaitItems(this ControlListBase<Label> labelsList, params string[] expectedItems)
        {
            labelsList.Wait(x => x.Text).That(Is.EquivalentTo(expectedItems));
        }

        public static void WaitItems(this Select select, string[] items)
        {
            select.GetItemsList().WaitItems(items);
            select.Click();
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

        private static ControlList<Label> GetItemsList(this Select select)
        {
            select.Click();
            var portal = select.Find<Portal>().By("noscript");
            return portal.FindList().Of<Label>("MenuItem").By("Menu");
        }

        private static IResolveConstraint ContainsMany(string[] substrings)
        {
            if (substrings.Length == 0)
                throw new InvalidOperationException("Expected ContainsSubstring constraint to have at least one substring");

            Constraint result = Contains.Substring(substrings[0]);
            foreach (var substring in substrings.Skip(1))
                result = result.And.Contains(substring);

            return result;
        }

        private static readonly IExceptionMatcher exceptionMatcher = ExceptionMatcher.FromTypes(typeof(WebDriverException), typeof(InvalidOperationException), typeof(ElementNotFoundException));
    }
}