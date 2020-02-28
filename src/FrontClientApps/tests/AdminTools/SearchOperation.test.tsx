import { expect } from "chai";

function searchInQuery(x: string): string {
    const arrOfOpeators = ["<=", ">=", "!=", ">", "<", "="];
    const operator = arrOfOpeators.filter(val => x.includes(val))[0];
    return operator;
}

describe("SearchOpeartionInQuery", () => {
    it("должен найти >", () => {
        expect(searchInQuery("a>b")).to.eql(">");
    });
    it("должен найти =", () => {
        expect(searchInQuery("a=b")).to.eql("=");
    });
    it("должен найти !=", () => {
        expect(searchInQuery("a!=b")).to.eql("!=");
    });
    it("должен найти >=", () => {
        expect(searchInQuery("a>=b")).to.eql(">=");
    });
    it("должен найти <=", () => {
        expect(searchInQuery("a<=b")).to.eql("<=");
    });
});
