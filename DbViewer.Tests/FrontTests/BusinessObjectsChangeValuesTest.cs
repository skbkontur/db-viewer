using System;
using System.Linq;

using Cassandra.Data.Linq;

using FluentAssertions;

using Microsoft.EntityFrameworkCore;

using NUnit.Framework;

using OpenQA.Selenium;

using SkbKontur.DbViewer.TestApi.Cql;
using SkbKontur.DbViewer.TestApi.EntityFramework;
using SkbKontur.DbViewer.TestApi.Impl.Document;
using SkbKontur.DbViewer.Tests.FrontTests.Helpers;
using SkbKontur.DbViewer.Tests.FrontTests.Pages;

namespace SkbKontur.DbViewer.Tests.FrontTests
{
    [TestFixture("CqlDocument")]
    [TestFixture("SqlDocument")]
    public class BusinessObjectsChangeValuesTest
    {
        public BusinessObjectsChangeValuesTest(string documentName)
        {
            this.documentName = documentName;
        }

        /// <summary>
        ///     Меняем значение имени организации, которое является строковым полем. Меняем как для случая с заполненным полем, так и с незаполненным.
        ///     Проверяем, что заданные значения сохраняются
        /// </summary>
        [Test]
        public void TestChangeOrganizationName()
        {
            var documentId = CreateDocument(documentName);

            using var browser = new BrowserForTests();
            var businessObjectEditingPage = browser.LoginAsSuperUser().SwitchTo<BusinessObjectDetailsPage>(documentName, $"Id={documentId}");

            var filledNumberRow = businessObjectEditingPage.RootAccordion.FindField("DocumentNumber");
            filledNumberRow.FieldValue.WaitText("123");
            filledNumberRow.Edit.Click();
            filledNumberRow.FieldValue.Input.ClearAndInputText("2qwe123QWE2");
            filledNumberRow.Save.Click();
            filledNumberRow.FieldValue.WaitText("2qwe123QWE2");

            browser.WebDriver.Navigate().Refresh();
            filledNumberRow = businessObjectEditingPage.RootAccordion.FindField("DocumentNumber");
            filledNumberRow.FieldValue.WaitText("2qwe123QWE2");

            GetDocument(documentName, documentId).DocumentNumber.Should().Be("2qwe123QWE2");

            businessObjectEditingPage.RootAccordion.FindAccordionToggle("DocumentContent").ToggleButton.Click();
            var unfilledNumberRow = businessObjectEditingPage.RootAccordion.FindField("DocumentContent_OrdersNumber");
            unfilledNumberRow.FieldValue.WaitText("null");
            unfilledNumberRow.Edit.Click();
            unfilledNumberRow.FieldValue.Input.ClearAndInputText("123");
            unfilledNumberRow.Save.Click();
            unfilledNumberRow.FieldValue.WaitText("123");

            browser.WebDriver.Navigate().Refresh();
            businessObjectEditingPage.RootAccordion.FindAccordionToggle("DocumentContent").ToggleButton.Click();
            unfilledNumberRow = businessObjectEditingPage.RootAccordion.FindField("DocumentContent_OrdersNumber");
            unfilledNumberRow.FieldValue.WaitText("123");

            GetDocument(documentName, documentId).DocumentContent.OrdersNumber.Should().Be("123");
        }

        /// <summary>
        ///     Меняем значение даты документа как для случая с заполненным полем, так и с незаполненным.
        ///     Проверяем, что заданные значения сохраняются
        /// </summary>
        [Test]
        public void TestChangeDocumentDates()
        {
            var documentId = CreateDocument(documentName);

            using var browser = new BrowserForTests();
            var businessObjectEditingPage = browser.LoginAsSuperUser().SwitchTo<BusinessObjectDetailsPage>(documentName, $"Id={documentId}");

            var filledDateRow = businessObjectEditingPage.RootAccordion.FindField("DocumentDate");
            filledDateRow.FieldValue.WaitTextContains("2014-12-11");
            filledDateRow.Edit.Click();
            filledDateRow.FieldValue.Date.ClearAndInputText("13.12.2014");
            filledDateRow.FieldValue.Time.ClearAndInputText("10:18");
            filledDateRow.Save.Click();
            filledDateRow.FieldValue.WaitTextContains("2014-12-13");

            browser.WebDriver.Navigate().Refresh();
            filledDateRow = businessObjectEditingPage.RootAccordion.FindField("DocumentDate");
            filledDateRow.FieldValue.WaitTextContains("2014-12-13");

            GetDocument(documentName, documentId).DocumentDate.Should().Be(new DateTimeOffset(2014, 12, 13, 10, 18, 00, 00, TimeSpan.Zero));

            businessObjectEditingPage.RootAccordion.FindAccordionToggle("DocumentContent").ToggleButton.Click();
            var unfilledDateRow = businessObjectEditingPage.RootAccordion.FindField("DocumentContent_DeliveryDate");
            unfilledDateRow.FieldValue.WaitText("null");
            unfilledDateRow.Edit.Click();
            unfilledDateRow.FieldValue.Date.ClearAndInputText("14.12.2014");
            unfilledDateRow.FieldValue.Time.ClearAndInputText("20:19");
            unfilledDateRow.Save.Click();
            unfilledDateRow.FieldValue.WaitText("2014-12-14T20:19:00Z");

            browser.WebDriver.Navigate().Refresh();
            businessObjectEditingPage.RootAccordion.FindAccordionToggle("DocumentContent").ToggleButton.Click();
            unfilledDateRow = businessObjectEditingPage.RootAccordion.FindField("DocumentContent_DeliveryDate");
            unfilledDateRow.FieldValue.WaitText("2014-12-14T20:19:00Z");

            GetDocument(documentName, documentId).DocumentContent.DeliveryDate.Should().Be(new DateTime(2014, 12, 14, 20, 19, 00, 00, DateTimeKind.Utc));
        }

        /// <summary>
        ///     Меняем значение enum в документе.
        ///     Меняем на валидное значение, ждем, что значение сохранится.
        ///     Меняем на пустое значение, ждем, что засетится null.
        /// </summary>
        [Test]
        public void TestChangeEnumValue()
        {
            var documentId = CreateDocument(documentName);

            using var browser = new BrowserForTests();
            var businessObjectEditingPage = browser.LoginAsSuperUser().SwitchTo<BusinessObjectDetailsPage>(documentName, $"Id={documentId}");

            var filledEnumRow = businessObjectEditingPage.RootAccordion.FindField("DocumentType");
            filledEnumRow.FieldValue.WaitText("Orders");
            filledEnumRow.Edit.Click();
            filledEnumRow.FieldValue.EnumSelect.WaitItems(new[] {"Orders", "Desadv"});
            filledEnumRow.FieldValue.EnumSelect.SelectValueByText("Desadv");
            filledEnumRow.Save.Click();
            filledEnumRow.FieldValue.WaitText("Desadv");

            browser.WebDriver.Navigate().Refresh();
            filledEnumRow = businessObjectEditingPage.RootAccordion.FindField("DocumentType");
            filledEnumRow.FieldValue.WaitText("Desadv");

            GetDocument(documentName, documentId).DocumentType.Should().Be(DocumentType.Desadv);

            businessObjectEditingPage.RootAccordion.FindAccordionToggle("DocumentContent").ToggleButton.Click();
            var nullableEnumRow = businessObjectEditingPage.RootAccordion.FindField("DocumentContent_OrderStatus");
            nullableEnumRow.FieldValue.WaitText("Processed");
            nullableEnumRow.Edit.Click();
            nullableEnumRow.FieldValue.EnumSelect.WaitItems(new[] {"null", "Processed", "Failed"});
            nullableEnumRow.FieldValue.EnumSelect.SelectValueByText("null");
            nullableEnumRow.Save.Click();
            nullableEnumRow.FieldValue.WaitText("null");

            browser.WebDriver.Navigate().Refresh();
            businessObjectEditingPage.RootAccordion.FindAccordionToggle("DocumentContent").ToggleButton.Click();
            nullableEnumRow = businessObjectEditingPage.RootAccordion.FindField("DocumentContent_OrderStatus");
            nullableEnumRow.FieldValue.WaitText("null");

            GetDocument(documentName, documentId).DocumentContent.OrderStatus.Should().BeNull();
        }

        /// <summary>
        ///     Меняем значение с false на true и обратно, во всех случаях проверяем, что значение сохранится
        /// </summary>
        [Test]
        public void TestChangeBooleanValue()
        {
            var documentId = CreateDocument(documentName);

            using var browser = new BrowserForTests();
            var businessObjectEditingPage = browser.LoginAsSuperUser().SwitchTo<BusinessObjectDetailsPage>(documentName, $"Id={documentId}");

            var booleanRow = businessObjectEditingPage.RootAccordion.FindField("IsLargeDocument");
            booleanRow.FieldValue.WaitText("false");
            booleanRow.Edit.Click();
            booleanRow.FieldValue.BooleanSelect.WaitItems(new[] {"false", "true"});
            booleanRow.FieldValue.BooleanSelect.SelectValueByText("true");
            booleanRow.Save.Click();
            booleanRow.FieldValue.WaitText("true");

            browser.WebDriver.Navigate().Refresh();
            booleanRow = businessObjectEditingPage.RootAccordion.FindField("IsLargeDocument");
            booleanRow.FieldValue.WaitText("true");

            GetDocument(documentName, documentId).IsLargeDocument.Should().BeTrue();

            businessObjectEditingPage.RootAccordion.FindAccordionToggle("DocumentContent").ToggleButton.Click();
            var nullableBoolRow = businessObjectEditingPage.RootAccordion.FindField("DocumentContent_WasRead");
            nullableBoolRow.FieldValue.WaitText("true");
            nullableBoolRow.Edit.Click();
            nullableBoolRow.FieldValue.BooleanSelect.WaitItems(new[] {"null", "false", "true"});
            nullableBoolRow.FieldValue.BooleanSelect.SelectValueByText("null");
            nullableBoolRow.Save.Click();
            nullableBoolRow.FieldValue.WaitText("null");

            browser.WebDriver.Navigate().Refresh();
            businessObjectEditingPage.RootAccordion.FindAccordionToggle("DocumentContent").ToggleButton.Click();
            nullableBoolRow = businessObjectEditingPage.RootAccordion.FindField("DocumentContent_WasRead");
            nullableBoolRow.FieldValue.WaitText("null");

            GetDocument(documentName, documentId).DocumentContent.WasRead.Should().BeNull();
        }

        /// <summary>
        ///     Меняем значение числового поля, ждем, что значение сохранится
        /// </summary>
        [Test]
        public void TestChangeNumericValue()
        {
            var documentId = CreateDocument(documentName);

            using var browser = new BrowserForTests();
            var businessObjectEditingPage = browser.LoginAsSuperUser().SwitchTo<BusinessObjectDetailsPage>(documentName, $"Id={documentId}");

            var integerRow = businessObjectEditingPage.RootAccordion.FindField("ShardNumber");
            integerRow.FieldValue.WaitText("0");
            integerRow.Edit.Click();
            integerRow.FieldValue.Input.AppendText($"{Keys.Control}a");
            integerRow.FieldValue.Input.AppendText("12.,45");
            integerRow.Save.Click();
            integerRow.FieldValue.WaitText("1245");
            integerRow.Edit.Click();
            integerRow.FieldValue.Input.AppendText($"{Keys.Control}a");
            integerRow.FieldValue.Input.AppendText("14ab");
            integerRow.Save.Click();
            integerRow.FieldValue.WaitText("14");

            browser.WebDriver.Navigate().Refresh();
            integerRow = businessObjectEditingPage.RootAccordion.FindField("ShardNumber");
            integerRow.FieldValue.WaitText("14");

            GetDocument(documentName, documentId).ShardNumber.Should().Be(14);

            var decimalRow = businessObjectEditingPage.RootAccordion.FindField("DocumentPrice");
            decimalRow.FieldValue.WaitText("10.1");
            decimalRow.Edit.Click();
            decimalRow.FieldValue.Input.AppendText($"{Keys.Control}a");
            decimalRow.FieldValue.Input.AppendText("12,45");
            decimalRow.Save.Click();
            decimalRow.FieldValue.WaitText("12.45");

            browser.WebDriver.Navigate().Refresh();
            decimalRow = businessObjectEditingPage.RootAccordion.FindField("DocumentPrice");
            decimalRow.FieldValue.WaitText("12.45");

            GetDocument(documentName, documentId).DocumentPrice.Should().Be(12.45m);

            businessObjectEditingPage.RootAccordion.FindAccordionToggle("DocumentContent").ToggleButton.Click();
            var nullableDecimalRow = businessObjectEditingPage.RootAccordion.FindField("DocumentContent_TotalAmount");
            nullableDecimalRow.FieldValue.WaitText("10.2");
            nullableDecimalRow.Edit.Click();
            nullableDecimalRow.FieldValue.Input.AppendText($"{Keys.Control}a{Keys.Delete}");
            nullableDecimalRow.Save.Click();
            nullableDecimalRow.FieldValue.WaitText("null");

            browser.WebDriver.Navigate().Refresh();
            businessObjectEditingPage.RootAccordion.FindAccordionToggle("DocumentContent").ToggleButton.Click();
            nullableDecimalRow = businessObjectEditingPage.RootAccordion.FindField("DocumentContent_TotalAmount");
            nullableDecimalRow.FieldValue.WaitText("null");

            GetDocument(documentName, documentId).DocumentContent.TotalAmount.Should().BeNull();
        }

        /// <summary>
        ///     Проверяем, что можно поменять произвольное поле в GoodItem'е, то есть в элементе массива.
        ///     Ждем, что изменения сохранятся
        /// </summary>
        [Test]
        public void TestChangeValueInArrayElement()
        {
            var documentId = CreateDocument(documentName);

            using var browser = new BrowserForTests();
            var businessObjectEditingPage = browser.LoginAsSuperUser().SwitchTo<BusinessObjectDetailsPage>(documentName, $"Id={documentId}");

            businessObjectEditingPage.RootAccordion.FindAccordionToggle("DocumentContent").ToggleButton.Click();
            businessObjectEditingPage.RootAccordion.FindAccordionToggle("DocumentContent_GoodItems").ToggleButton.Click();
            businessObjectEditingPage.RootAccordion.FindAccordionToggle("DocumentContent_GoodItems_0").ToggleButton.Click();
            var inArrayFieldRow = businessObjectEditingPage.RootAccordion.FindField("DocumentContent_GoodItems_0_Name");
            inArrayFieldRow.FieldValue.WaitText("Name of lintem");
            inArrayFieldRow.Edit.Click();
            inArrayFieldRow.FieldValue.Input.ClearAndInputText("Changed name");
            inArrayFieldRow.Save.Click();
            inArrayFieldRow.FieldValue.WaitText("Changed name");

            browser.WebDriver.Navigate().Refresh();
            businessObjectEditingPage.RootAccordion.FindAccordionToggle("DocumentContent").ToggleButton.Click();
            businessObjectEditingPage.RootAccordion.FindAccordionToggle("DocumentContent_GoodItems").ToggleButton.Click();
            businessObjectEditingPage.RootAccordion.FindAccordionToggle("DocumentContent_GoodItems_0").ToggleButton.Click();
            inArrayFieldRow = businessObjectEditingPage.RootAccordion.FindField("DocumentContent_GoodItems_0_Name");
            inArrayFieldRow.FieldValue.WaitText("Changed name");

            GetDocument(documentName, documentId).DocumentContent.GoodItems[0].Name.Should().Be("Changed name");

            businessObjectEditingPage.RootAccordion.FindAccordionToggle("DocumentContent_GoodItems_1").ToggleButton.Click();
            businessObjectEditingPage.RootAccordion.FindAccordionToggle("DocumentContent_GoodItems_1_CustomDeclarationNumbers").ToggleButton.Click();
            var inArrayInArrayFieldRow = businessObjectEditingPage.RootAccordion.FindField("DocumentContent_GoodItems_1_CustomDeclarationNumbers_0");
            inArrayInArrayFieldRow.FieldValue.WaitText("224");
            inArrayInArrayFieldRow.Edit.Click();
            inArrayInArrayFieldRow.FieldValue.Input.ClearAndInputText("225a");
            inArrayInArrayFieldRow.Save.Click();
            inArrayInArrayFieldRow.FieldValue.WaitText("225a");

            browser.WebDriver.Navigate().Refresh();
            businessObjectEditingPage.RootAccordion.FindAccordionToggle("DocumentContent").ToggleButton.Click();
            businessObjectEditingPage.RootAccordion.FindAccordionToggle("DocumentContent_GoodItems").ToggleButton.Click();
            businessObjectEditingPage.RootAccordion.FindAccordionToggle("DocumentContent_GoodItems_1").ToggleButton.Click();
            businessObjectEditingPage.RootAccordion.FindAccordionToggle("DocumentContent_GoodItems_1_CustomDeclarationNumbers").ToggleButton.Click();
            inArrayInArrayFieldRow = businessObjectEditingPage.RootAccordion.FindField("DocumentContent_GoodItems_1_CustomDeclarationNumbers_0");
            inArrayInArrayFieldRow.FieldValue.WaitText("225a");

            GetDocument(documentName, documentId).DocumentContent.GoodItems[1].CustomDeclarationNumbers[0].Should().Be("225a");
        }

        /// <summary>
        ///     Проверяем, что поля ScopeId и Id нельзя изменить
        /// </summary>
        [Test]
        public void TestCanNotEditScopeIdAndId()
        {
            var documentId = CreateDocument(documentName);

            using var browser = new BrowserForTests();
            var businessObjectEditingPage = browser.LoginAsSuperUser().SwitchTo<BusinessObjectDetailsPage>(documentName, $"Id={documentId}");

            var row = businessObjectEditingPage.RootAccordion.FindField("id");
            row.Edit.WaitAbsence();
        }

        private static Guid CreateDocument(string documentName)
        {
            var documentModel = CqlDocumentsForTests.GetDocumentModel();
            switch (documentName)
            {
            case "SqlDocument":
                CreateSqlDocument(documentModel);
                break;
            case "CqlDocument":
                CreateCqlDocument(documentModel);
                break;
            default:
                throw new InvalidOperationException();
            }
            return documentModel.Id;
        }

        private static void CreateSqlDocument(DocumentModel documentModel)
        {
            using var context = new EntityFrameworkDbContext();
            context.Documents.Add(documentModel.ToSqlDocument());
            context.SaveChanges();
        }

        private static void CreateCqlDocument(DocumentModel documentModel)
        {
            using var context = new CqlDbContext();
            var table = context.GetTable<CqlDocument>();
            table.Insert(documentModel.ToCqlDocument()).SetTimestamp(DateTimeOffset.UtcNow).Execute();
        }

        private static DocumentModel GetDocument(string documentName, Guid documentId)
        {
            return documentName switch
                {
                    "SqlDocument" => GetSqlDocument(documentId),
                    "CqlDocument" => GetCqlDocument(documentId),
                    _ => throw new InvalidOperationException()
                };
        }

        private static DocumentModel GetSqlDocument(Guid documentId)
        {
            using var context = new EntityFrameworkDbContext();
            return context.Documents.AsNoTracking().Single(x => x.Id == documentId).ToDocumentModel();
        }

        private static DocumentModel GetCqlDocument(Guid documentId)
        {
            using var context = new CqlDbContext();
            var table = context.GetTable<CqlDocument>();
            return table.Where(x => x.Id == documentId).Execute().Single().ToDocumentModel();
        }

        private readonly string documentName;
    }
}