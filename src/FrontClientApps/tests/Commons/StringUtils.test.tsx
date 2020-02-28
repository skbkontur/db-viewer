import { expect } from "chai";

import { ArgumentError } from "Commons/Utils/Errors";
import { StringUtils } from "Commons/Utils/StringUtils";

describe("StringUtils", () => {
    describe("removeLeadingZeroes", () => {
        it("должен удалять начальные нули", () => {
            expect(StringUtils.removeLeadingZeroes("0001")).to.eql("1");
            expect(StringUtils.removeLeadingZeroes("000aaaa")).to.eql("aaaa");
            expect(StringUtils.removeLeadingZeroes("1")).to.eql("1");
            expect(StringUtils.removeLeadingZeroes("10")).to.eql("10");
            expect(StringUtils.removeLeadingZeroes("0")).to.eql("");
            expect(StringUtils.removeLeadingZeroes("")).to.eql("");
            expect(StringUtils.removeLeadingZeroes(null)).to.equal(null);
            expect(StringUtils.removeLeadingZeroes(undefined)).to.equal(undefined);
        });
    });

    describe("trimStart", () => {
        it("должен удалять начальные символы", () => {
            expect(StringUtils.trimStart("aaa1", "a")).to.eql("1");
            expect(StringUtils.trimStart("bbbaaaa", "b")).to.eql("aaaa");
            expect(StringUtils.trimStart("1", "b")).to.eql("1");
            expect(StringUtils.trimStart("1b", "b")).to.eql("1b");
            expect(StringUtils.trimStart("b", "b")).to.eql("");
            expect(StringUtils.trimStart("", "b")).to.eql("");
            expect(StringUtils.trimStart(null, "b")).to.equal(null);
            expect(StringUtils.trimStart(undefined, "b")).to.equal(undefined);
        });

        it("должен кидать исключение если character.length !== 1", () => {
            expect(() => StringUtils.trimStart("abab1", "ab")).to.throw(ArgumentError);
            expect(() => StringUtils.trimStart("abab1", "")).to.throw(ArgumentError);
            expect(() => StringUtils.trimStart("abab1", null as any)).to.throw(ArgumentError);
            expect(() => StringUtils.trimStart("abab1", undefined as any)).to.throw(ArgumentError);
        });
    });

    describe("normalizeWhitespaces", () => {
        it("должен удалять начальные пробелы", () => {
            expect(StringUtils.normalizeWhitespaces(" 1 ")).to.eql("1");
            expect(StringUtils.normalizeWhitespaces("1 ")).to.eql("1");
            expect(StringUtils.normalizeWhitespaces(" 1")).to.eql("1");
            expect(StringUtils.normalizeWhitespaces("    ")).to.eql("");
            expect(StringUtils.normalizeWhitespaces(null)).to.equal(null);
            expect(StringUtils.normalizeWhitespaces(undefined)).to.equal(undefined);
        });

        it("должен удалять лишние пробелы между словами", () => {
            expect(StringUtils.normalizeWhitespaces("a     b")).to.eql("a b");
            expect(StringUtils.normalizeWhitespaces("a  b   c    d")).to.eql("a b c d");
        });
    });
});
