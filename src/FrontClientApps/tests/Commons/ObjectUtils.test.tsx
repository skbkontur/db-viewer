import { should } from "chai";

import { ObjectUtils } from "Commons/Utils/ObjectUtils";

const resultShould = should();

describe("ObjectUtils", () => {
    describe("deleteRedundantWhitespaces", () => {
        it("должен удалять лишние пробелы из строки", () => {
            ObjectUtils.deleteRedundantWhitespaces(" abc   de ").should.equal("abc de");
        });

        it("должен игнорировать даты", () => {
            const currentDate = Date.now();
            ObjectUtils.deleteRedundantWhitespaces(currentDate).should.equal(currentDate);
        });

        it("должен игнорировать null и undefined", () => {
            resultShould.not.exist(ObjectUtils.deleteRedundantWhitespaces(undefined));
            resultShould.not.exist(ObjectUtils.deleteRedundantWhitespaces(undefined));
        });

        it("должен удалять лишние пробелы из строк в массиве", () => {
            ObjectUtils.deleteRedundantWhitespaces([1, " 2", "3 ", " 4 "]).should.deep.equal([1, "2", "3", "4"]);
        });

        it("должен удалять лишние пробелы из строк в вложенных объектах", () => {
            const inner_obj = { text: " 2 " };
            const testObj = { inner: inner_obj };
            ObjectUtils.deleteRedundantWhitespaces(testObj).should.have.property("inner");
            ObjectUtils.deleteRedundantWhitespaces(testObj).inner.should.have.property("text", "2");
        });

        it("не должен мутировать исходные объекты", () => {
            const array = [1, " 2 "];
            const inner_obj = { testArray: array };
            const testObj = { text: " 1 ", inner: inner_obj };

            const newObj = ObjectUtils.deleteRedundantWhitespaces(testObj);
            newObj.should.not.equal(inner_obj);
            newObj.inner.should.not.equal(inner_obj);
            newObj.inner.testArray.should.not.equal(array);
        });
    });

    describe("removeWhitespaceFields", () => {
        it("должен превращать поля объектов со строками состоящими из пробелов в null", () => {
            ObjectUtils.removeWhitespaceFields({ a: "     " }).should.deep.eq({ a: null });
        });

        it("должен превращать поля массивов со строками состоящими из пробелов в null", () => {
            ObjectUtils.removeWhitespaceFields(["     "]).should.deep.eq([null]);
        });

        it("должен превращать поля вложенных массивов со строками состоящими из пробелов в null", () => {
            ObjectUtils.removeWhitespaceFields({ a: ["     ", 1] }).should.deep.eq({ a: [null, 1] });
        });

        it("должен превращать поля вложенных объектов со строками состоящими из пробелов в null", () => {
            ObjectUtils.removeWhitespaceFields({ a: { b: "  " } }).should.deep.eq({ a: { b: null } });
        });

        it("должен превращать строки состоящие из пробелов в null", () => {
            resultShould.not.exist(ObjectUtils.removeWhitespaceFields("     "));
        });

        it("не должен изменять поля объектов со строками состоящими не только из пробелов", () => {
            ObjectUtils.removeWhitespaceFields({ a: "   d  " }).should.deep.eq({ a: "   d  " });
        });

        it("не должен изменять поля массивов со строками состоящими не только из пробелов", () => {
            ObjectUtils.removeWhitespaceFields(["   d  "]).should.deep.eq(["   d  "]);
        });

        it("не должен изменять поля вложенных массивов со строками состоящими не только из пробелов", () => {
            ObjectUtils.removeWhitespaceFields({ a: ["   d  "] }).should.deep.eq({ a: ["   d  "] });
        });

        it("не должен изменять поля вложенных объектов со строками состоящими не только из пробелов", () => {
            ObjectUtils.removeWhitespaceFields({ a: { b: "  d " } }).should.deep.eq({ a: { b: "  d " } });
        });

        it("не должен изменять строки состоящие не только из пробелов", () => {
            ObjectUtils.removeWhitespaceFields("   d  ").should.eq("   d  ");
        });

        it("не должен изменять даты", () => {
            const date = new Date(2019, 8, 1, 10, 0, 0, 0);
            ObjectUtils.removeWhitespaceFields({ a: date }).should.deep.eq({ a: date });
        });

        it("не должен изменять исходные объекты", () => {
            const array = [1, "   "];
            const inner_obj = { testArray: array };
            const testObj = { text: " 1 ", inner: inner_obj };

            const newObj = ObjectUtils.removeWhitespaceFields(testObj);
            newObj.should.not.equal(inner_obj);
            newObj.inner.should.not.equal(inner_obj);
            newObj.inner.testArray.should.not.equal(array);
        });

        it("не должен превращать массивы в объекты", () => {
            const newObj = ObjectUtils.removeWhitespaceFields({ text: " 1 ", inner: { testArray: [1, "  "] } });
            newObj.should.deep.eq({ text: " 1 ", inner: { testArray: [1, null] } });
        });
    });

    describe("containsInAnyValueSubstring", () => {
        const defaultSearchOptions = { ignoreCase: true };

        it("should return false when all values doesn't contain input string", () => {
            const result = ObjectUtils.containsInAnyValueSubstring({ a: "abc" }, "d", defaultSearchOptions);
            result.should.eq(false);
        });

        it("should return false when input string similar with non-string value", () => {
            const result = ObjectUtils.containsInAnyValueSubstring({ a: 123 }, "123", defaultSearchOptions);
            result.should.eq(false);
        });

        it("should return true when string value contains input string", () => {
            const result = ObjectUtils.containsInAnyValueSubstring({ a: "abc" }, "b", defaultSearchOptions);
            result.should.eq(true);
        });

        it("should return true when string value starts with input string", () => {
            const result = ObjectUtils.containsInAnyValueSubstring({ a: "abc" }, "a", defaultSearchOptions);
            result.should.eq(true);
        });

        it("should return true when string value ends with input string", () => {
            const result = ObjectUtils.containsInAnyValueSubstring({ a: "abc" }, "c", defaultSearchOptions);
            result.should.eq(true);
        });

        it("should return true when sring value of nested object contains input string", () => {
            const result = ObjectUtils.containsInAnyValueSubstring(
                { a: "v", b: { c: "result" } },
                "es",
                defaultSearchOptions
            );
            result.should.eq(true);
        });

        it("should return true when one of array item contains input string", () => {
            const result = ObjectUtils.containsInAnyValueSubstring(
                { a: ["ab", "cd", "ef"] },
                "c",
                defaultSearchOptions
            );
            result.should.eq(true);
        });

        it("should return true when one of array item in nested object contains input string", () => {
            const result = ObjectUtils.containsInAnyValueSubstring(
                { a: "v", b: { c: ["a", "result", "c"] } },
                "es",
                defaultSearchOptions
            );
            result.should.eq(true);
        });

        it("should return true when one of object in array has any values that contains input string", () => {
            const result = ObjectUtils.containsInAnyValueSubstring(
                { a: "v", b: { c: [{ d: "a" }, { d: "f" }, { d: "g" }] } },
                "f",
                defaultSearchOptions
            );
            result.should.eq(true);
        });

        it("should ignore case if searchOptions.ignoreCase == true ", () => {
            const result = ObjectUtils.containsInAnyValueSubstring({ a: "F" }, "f", defaultSearchOptions);
            result.should.eq(true);
        });

        it("should be case sensetive if searchOptions.ignoreCase == false ", () => {
            const result = ObjectUtils.containsInAnyValueSubstring({ a: "F" }, "f", { ignoreCase: false });
            result.should.eq(false);
        });

        it("should don't search matches in excluded from search fields ", () => {
            const searchOptions = {
                ignoreCase: false,
                isExcludedFromSearchField: (x: string) => x === "id",
            };
            const result = ObjectUtils.containsInAnyValueSubstring({ id: "f" }, "f", searchOptions);
            result.should.eq(false);
        });

        it("should return false when object is empty", () => {
            const result = ObjectUtils.containsInAnyValueSubstring({}, "f", defaultSearchOptions);
            result.should.eq(false);
        });

        it("should return false when object has only empty fields", () => {
            const result = ObjectUtils.containsInAnyValueSubstring({ a: null }, "f", defaultSearchOptions);
            result.should.eq(false);
        });
    });
});
