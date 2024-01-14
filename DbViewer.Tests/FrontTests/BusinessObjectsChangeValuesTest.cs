using System;
using System.Linq;
using System.Threading.Tasks;

using Cassandra.Data.Linq;

using FluentAssertions;

using Microsoft.EntityFrameworkCore;

using NUnit.Framework;

using SkbKontur.DbViewer.TestApi.Cql;
using SkbKontur.DbViewer.TestApi.EntityFramework;
using SkbKontur.DbViewer.TestApi.Impl.Document;
using SkbKontur.DbViewer.Tests.FrontTests.Pages;
using SkbKontur.DbViewer.Tests.FrontTests.Playwright;

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
        public async Task TestChangeOrganizationName()
        {
            var documentId = CreateDocument(documentName);

            await using var browser = new Browser();
            var businessObjectEditingPage = await (await browser.LoginAsSuperUser()).SwitchTo<PwBusinessObjectDetailsPage>(documentName, $"Id={documentId}");

            var filledNumberRow = businessObjectEditingPage.RootAccordion.FindField("DocumentNumber");
            await filledNumberRow.FieldValue.WaitText("123");
            await filledNumberRow.Edit.Click();
            await filledNumberRow.FieldValue.Input.ClearAndInputText("2qwe123QWE2");
            await filledNumberRow.Save.Click();
            await filledNumberRow.FieldValue.WaitText("2qwe123QWE2");

            await businessObjectEditingPage.Page.ReloadAsync();
            filledNumberRow = businessObjectEditingPage.RootAccordion.FindField("DocumentNumber");
            await filledNumberRow.FieldValue.WaitText("2qwe123QWE2");

            GetDocument(documentName, documentId).DocumentNumber.Should().Be("2qwe123QWE2");

            await businessObjectEditingPage.RootAccordion.FindAccordionToggle("DocumentContent").ToggleButton.Click();
            var unfilledNumberRow = businessObjectEditingPage.RootAccordion.FindField("DocumentContent_OrdersNumber");
            await unfilledNumberRow.FieldValue.WaitText("null");
            await unfilledNumberRow.Edit.Click();
            await unfilledNumberRow.FieldValue.Input.ClearAndInputText("123");
            await unfilledNumberRow.Save.Click();
            await unfilledNumberRow.FieldValue.WaitText("123");

            await businessObjectEditingPage.Page.ReloadAsync();
            await businessObjectEditingPage.RootAccordion.FindAccordionToggle("DocumentContent").ToggleButton.Click();
            unfilledNumberRow = businessObjectEditingPage.RootAccordion.FindField("DocumentContent_OrdersNumber");
            await unfilledNumberRow.FieldValue.WaitText("123");

            GetDocument(documentName, documentId).DocumentContent.OrdersNumber.Should().Be("123");
        }

        /// <summary>
        ///     Меняем значение даты документа как для случая с заполненным полем, так и с незаполненным.
        ///     Проверяем, что заданные значения сохраняются
        /// </summary>
        [Test]
        public async Task TestChangeDocumentDates()
        {
            var documentId = CreateDocument(documentName);

            await using var browser = new Browser();
            var businessObjectEditingPage = await (await browser.LoginAsSuperUser()).SwitchTo<PwBusinessObjectDetailsPage>(documentName, $"Id={documentId}");

            var filledDateRow = businessObjectEditingPage.RootAccordion.FindField("DocumentDate");
            await filledDateRow.FieldValue.WaitTextContains("2014-12-11");
            await filledDateRow.Edit.Click();

            await filledDateRow.FieldValue.Date.ClearAndInputText("13.10.2016");
            await filledDateRow.FieldValue.Time.ClearAndInputText("10:18:13.567");
            await filledDateRow.FieldValue.TimeOffsetLabel.WaitText("+00:00");
            await filledDateRow.Save.Click();
            var expectedStr = "2016-10-13T10:18:13.567+00:00";
            await filledDateRow.FieldValue.WaitTextContains(expectedStr);

            await businessObjectEditingPage.Page.ReloadAsync();
            filledDateRow = businessObjectEditingPage.RootAccordion.FindField("DocumentDate");
            await filledDateRow.FieldValue.WaitTextContains(expectedStr);

            GetDocument(documentName, documentId).DocumentDate.Should().Be(new DateTimeOffset(2016, 10, 13, 10, 18, 13, 567, TimeSpan.Zero));

            await businessObjectEditingPage.RootAccordion.FindAccordionToggle("DocumentContent").ToggleButton.Click();
            var unfilledDateRow = businessObjectEditingPage.RootAccordion.FindField("DocumentContent_DeliveryDate");
            await unfilledDateRow.FieldValue.WaitText("null");
            await unfilledDateRow.Edit.Click();
            await unfilledDateRow.FieldValue.Date.ClearAndInputText("14.12.2014");
            await unfilledDateRow.FieldValue.Time.ClearAndInputText("20:19");
            await unfilledDateRow.FieldValue.TimeZoneSelect.SelectValueByText("UTC");
            await unfilledDateRow.Save.Click();
            await unfilledDateRow.FieldValue.WaitText("2014-12-14T20:19:00Z");

            await businessObjectEditingPage.Page.ReloadAsync();
            await businessObjectEditingPage.RootAccordion.FindAccordionToggle("DocumentContent").ToggleButton.Click();
            unfilledDateRow = businessObjectEditingPage.RootAccordion.FindField("DocumentContent_DeliveryDate");
            await unfilledDateRow.FieldValue.WaitText("2014-12-14T20:19:00Z");

            GetDocument(documentName, documentId).DocumentContent.DeliveryDate.Should().Be(new DateTime(2014, 12, 14, 20, 19, 00, 00, DateTimeKind.Utc));
        }

        /// <summary>
        ///     Меняем значение enum в документе.
        ///     Меняем на валидное значение, ждем, что значение сохранится.
        ///     Меняем на пустое значение, ждем, что засетится null.
        /// </summary>
        [Test]
        public async Task TestChangeEnumValue()
        {
            var documentId = CreateDocument(documentName);

            await using var browser = new Browser();
            var businessObjectEditingPage = await (await browser.LoginAsSuperUser()).SwitchTo<PwBusinessObjectDetailsPage>(documentName, $"Id={documentId}");

            var filledEnumRow = businessObjectEditingPage.RootAccordion.FindField("DocumentType");
            await filledEnumRow.FieldValue.WaitText("Orders");
            await filledEnumRow.Edit.Click();
            await filledEnumRow.FieldValue.EnumSelect.WaitItems(new[] {"Orders", "Desadv"});
            await filledEnumRow.FieldValue.EnumSelect.SelectValueByText("Desadv");
            await filledEnumRow.Save.Click();
            await filledEnumRow.FieldValue.WaitText("Desadv");

            await businessObjectEditingPage.Page.ReloadAsync();
            filledEnumRow = businessObjectEditingPage.RootAccordion.FindField("DocumentType");
            await filledEnumRow.FieldValue.WaitText("Desadv");

            GetDocument(documentName, documentId).DocumentType.Should().Be(DocumentType.Desadv);

            await businessObjectEditingPage.RootAccordion.FindAccordionToggle("DocumentContent").ToggleButton.Click();
            var nullableEnumRow = businessObjectEditingPage.RootAccordion.FindField("DocumentContent_OrderStatus");
            await nullableEnumRow.FieldValue.WaitText("Processed");
            await nullableEnumRow.Edit.Click();
            await nullableEnumRow.FieldValue.EnumSelect.WaitItems(new[] {"null", "Processed", "Failed"});
            await nullableEnumRow.FieldValue.EnumSelect.SelectValueByText("null");
            await nullableEnumRow.Save.Click();
            await nullableEnumRow.FieldValue.WaitText("null");

            await businessObjectEditingPage.Page.ReloadAsync();
            await businessObjectEditingPage.RootAccordion.FindAccordionToggle("DocumentContent").ToggleButton.Click();
            nullableEnumRow = businessObjectEditingPage.RootAccordion.FindField("DocumentContent_OrderStatus");
            await nullableEnumRow.FieldValue.WaitText("null");

            GetDocument(documentName, documentId).DocumentContent.OrderStatus.Should().BeNull();
        }

        /// <summary>
        ///     Меняем значение с false на true и обратно, во всех случаях проверяем, что значение сохранится
        /// </summary>
        [Test]
        public async Task TestChangeBooleanValue()
        {
            var documentId = CreateDocument(documentName);

            await using var browser = new Browser();
            var businessObjectEditingPage = await (await browser.LoginAsSuperUser()).SwitchTo<PwBusinessObjectDetailsPage>(documentName, $"Id={documentId}");

            var booleanRow = businessObjectEditingPage.RootAccordion.FindField("IsLargeDocument");
            await booleanRow.FieldValue.WaitText("false");
            await booleanRow.Edit.Click();
            await booleanRow.FieldValue.BooleanSelect.WaitItems(new[] {"true", "false"});
            await booleanRow.FieldValue.BooleanSelect.SelectValueByText("true");
            await booleanRow.Save.Click();
            await booleanRow.FieldValue.WaitText("true");

            await businessObjectEditingPage.Page.ReloadAsync();
            booleanRow = businessObjectEditingPage.RootAccordion.FindField("IsLargeDocument");
            await booleanRow.FieldValue.WaitText("true");

            GetDocument(documentName, documentId).IsLargeDocument.Should().BeTrue();

            await businessObjectEditingPage.RootAccordion.FindAccordionToggle("DocumentContent").ToggleButton.Click();
            var nullableBoolRow = businessObjectEditingPage.RootAccordion.FindField("DocumentContent_WasRead");
            await nullableBoolRow.FieldValue.WaitText("true");
            await nullableBoolRow.Edit.Click();
            await nullableBoolRow.FieldValue.BooleanSelect.WaitItems(new[] {"null", "true", "false"});
            await nullableBoolRow.FieldValue.BooleanSelect.SelectValueByText("null");
            await nullableBoolRow.Save.Click();
            await nullableBoolRow.FieldValue.WaitText("null");

            await businessObjectEditingPage.Page.ReloadAsync();
            await businessObjectEditingPage.RootAccordion.FindAccordionToggle("DocumentContent").ToggleButton.Click();
            nullableBoolRow = businessObjectEditingPage.RootAccordion.FindField("DocumentContent_WasRead");
            await nullableBoolRow.FieldValue.WaitText("null");

            GetDocument(documentName, documentId).DocumentContent.WasRead.Should().BeNull();
        }

        /// <summary>
        ///     Меняем значение числового поля, ждем, что значение сохранится
        /// </summary>
        [Test]
        public async Task TestChangeNumericValue()
        {
            var documentId = CreateDocument(documentName);

            await using var browser = new Browser();
            var businessObjectEditingPage = await (await browser.LoginAsSuperUser()).SwitchTo<PwBusinessObjectDetailsPage>(documentName, $"Id={documentId}");

            var integerRow = businessObjectEditingPage.RootAccordion.FindField("ShardNumber");
            await integerRow.FieldValue.WaitText("0");
            await integerRow.Edit.Click();
            await integerRow.FieldValue.Input.SelectAndInputText("12.,45");
            await integerRow.Save.Click();
            await integerRow.FieldValue.WaitText("1245");
            await integerRow.Edit.Click();
            await integerRow.FieldValue.Input.SelectAndInputText("14ab");
            await integerRow.Save.Click();
            await integerRow.FieldValue.WaitText("14");

            await businessObjectEditingPage.Page.ReloadAsync();
            integerRow = businessObjectEditingPage.RootAccordion.FindField("ShardNumber");
            await integerRow.FieldValue.WaitText("14");

            GetDocument(documentName, documentId).ShardNumber.Should().Be(14);

            var decimalRow = businessObjectEditingPage.RootAccordion.FindField("DocumentPrice");
            await decimalRow.FieldValue.WaitText("10.1");
            await decimalRow.Edit.Click();
            await decimalRow.FieldValue.Input.SelectAndInputText("12,45");
            await decimalRow.Save.Click();
            await decimalRow.FieldValue.WaitText("12.45");

            await businessObjectEditingPage.Page.ReloadAsync();
            decimalRow = businessObjectEditingPage.RootAccordion.FindField("DocumentPrice");
            await decimalRow.FieldValue.WaitText("12.45");

            GetDocument(documentName, documentId).DocumentPrice.Should().Be(12.45m);

            await businessObjectEditingPage.RootAccordion.FindAccordionToggle("DocumentContent").ToggleButton.Click();
            var nullableDecimalRow = businessObjectEditingPage.RootAccordion.FindField("DocumentContent_TotalAmount");
            await nullableDecimalRow.FieldValue.WaitText("10.2");
            await nullableDecimalRow.Edit.Click();
            await nullableDecimalRow.FieldValue.Input.Clear();
            await nullableDecimalRow.Save.Click();
            await nullableDecimalRow.FieldValue.WaitText("null");

            await businessObjectEditingPage.Page.ReloadAsync();
            await businessObjectEditingPage.RootAccordion.FindAccordionToggle("DocumentContent").ToggleButton.Click();
            nullableDecimalRow = businessObjectEditingPage.RootAccordion.FindField("DocumentContent_TotalAmount");
            await nullableDecimalRow.FieldValue.WaitText("null");

            GetDocument(documentName, documentId).DocumentContent.TotalAmount.Should().BeNull();
        }

        /// <summary>
        ///     Проверяем, что можно поменять произвольное поле в GoodItem'е, то есть в элементе массива.
        ///     Ждем, что изменения сохранятся
        /// </summary>
        [Test]
        public async Task TestChangeValueInArrayElement()
        {
            var documentId = CreateDocument(documentName);

            await using var browser = new Browser();
            var businessObjectEditingPage = await (await browser.LoginAsSuperUser()).SwitchTo<PwBusinessObjectDetailsPage>(documentName, $"Id={documentId}");

            await businessObjectEditingPage.RootAccordion.FindAccordionToggle("DocumentContent").ToggleButton.Click();
            await businessObjectEditingPage.RootAccordion.FindAccordionToggle("DocumentContent_GoodItems").ToggleButton.Click();
            await businessObjectEditingPage.RootAccordion.FindAccordionToggle("DocumentContent_GoodItems_0").ToggleButton.Click();
            var inArrayFieldRow = businessObjectEditingPage.RootAccordion.FindField("DocumentContent_GoodItems_0_Name");
            await inArrayFieldRow.FieldValue.WaitText("Name of lintem");
            await inArrayFieldRow.Edit.Click();
            await inArrayFieldRow.FieldValue.Input.ClearAndInputText("Changed name");
            await inArrayFieldRow.Save.Click();
            await inArrayFieldRow.FieldValue.WaitText("Changed name");

            await businessObjectEditingPage.Page.ReloadAsync();
            await businessObjectEditingPage.RootAccordion.FindAccordionToggle("DocumentContent").ToggleButton.Click();
            await businessObjectEditingPage.RootAccordion.FindAccordionToggle("DocumentContent_GoodItems").ToggleButton.Click();
            await businessObjectEditingPage.RootAccordion.FindAccordionToggle("DocumentContent_GoodItems_0").ToggleButton.Click();
            inArrayFieldRow = businessObjectEditingPage.RootAccordion.FindField("DocumentContent_GoodItems_0_Name");
            await inArrayFieldRow.FieldValue.WaitText("Changed name");

            GetDocument(documentName, documentId).DocumentContent.GoodItems[0].Name.Should().Be("Changed name");

            await businessObjectEditingPage.RootAccordion.FindAccordionToggle("DocumentContent_GoodItems_1").ToggleButton.Click();
            await businessObjectEditingPage.RootAccordion.FindAccordionToggle("DocumentContent_GoodItems_1_CustomDeclarationNumbers").ToggleButton.Click();
            var inArrayInArrayFieldRow = businessObjectEditingPage.RootAccordion.FindField("DocumentContent_GoodItems_1_CustomDeclarationNumbers_0");
            await inArrayInArrayFieldRow.FieldValue.WaitText("224");
            await inArrayInArrayFieldRow.Edit.Click();
            await inArrayInArrayFieldRow.FieldValue.Input.ClearAndInputText("225a");
            await inArrayInArrayFieldRow.Save.Click();
            await inArrayInArrayFieldRow.FieldValue.WaitText("225a");

            await businessObjectEditingPage.Page.ReloadAsync();
            await businessObjectEditingPage.RootAccordion.FindAccordionToggle("DocumentContent").ToggleButton.Click();
            await businessObjectEditingPage.RootAccordion.FindAccordionToggle("DocumentContent_GoodItems").ToggleButton.Click();
            await businessObjectEditingPage.RootAccordion.FindAccordionToggle("DocumentContent_GoodItems_1").ToggleButton.Click();
            await businessObjectEditingPage.RootAccordion.FindAccordionToggle("DocumentContent_GoodItems_1_CustomDeclarationNumbers").ToggleButton.Click();
            inArrayInArrayFieldRow = businessObjectEditingPage.RootAccordion.FindField("DocumentContent_GoodItems_1_CustomDeclarationNumbers_0");
            await inArrayInArrayFieldRow.FieldValue.WaitText("225a");

            GetDocument(documentName, documentId).DocumentContent.GoodItems[1].CustomDeclarationNumbers[0].Should().Be("225a");
        }

        /// <summary>
        ///     Проверяем, что поля ScopeId и Id нельзя изменить
        /// </summary>
        [Test]
        public async Task TestCanNotEditScopeIdAndId()
        {
            var documentId = CreateDocument(documentName);

            await using var browser = new Browser();
            var businessObjectEditingPage = await (await browser.LoginAsSuperUser()).SwitchTo<PwBusinessObjectDetailsPage>(documentName, $"Id={documentId}");

            var row = businessObjectEditingPage.RootAccordion.FindField("id");
            await row.Edit.WaitAbsence();
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