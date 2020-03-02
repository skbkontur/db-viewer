import { expect } from "chai";

import { createPages } from "Domain/Utils/PageNavigationUtils";

describe("createPages", () => {
    it("должен работать для одной страницы", () => {
        expect(createPages(1, 1)).to.eql([1]);
    });

    it("должен работать для двух страниц", () => {
        expect(createPages(2, 1)).to.eql([1, 2]);
    });

    it("должен работать для трех страниц", () => {
        expect(createPages(3, 1)).to.eql([1, 2, 3]);
    });

    it("6 страниц и 1-я текущая", () => {
        expect(createPages(6, 1)).to.eql([1, 2, 3, null, 5, 6]);
    });

    it("6 страниц и 2-я текущая", () => {
        expect(createPages(6, 2)).to.eql([1, 2, 3, 4, 5, 6]);
    });

    it("6 страниц и 6-я текущая", () => {
        expect(createPages(6, 6)).to.eql([1, 2, null, 4, 5, 6]);
    });

    it("6 страниц и 5-я текущая", () => {
        expect(createPages(6, 5)).to.eql([1, 2, 3, 4, 5, 6]);
    });

    it("12 страниц и 7-я текущая", () => {
        expect(createPages(12, 7)).to.eql([1, 2, null, 5, 6, 7, 8, 9, null, 11, 12]);
    });
    it("100 страниц и 1-я текущая (limit = 50)", () => {
        expect(createPages(100, 1, 50)).to.eql([1, 2, 3, null]);
    });
    it("100 страниц и 25-я текущая (limit = 50)", () => {
        expect(createPages(100, 25, 50)).to.eql([1, 2, null, 23, 24, 25, 26, 27, null]);
    });

    it("100 страниц и 50-я текущая (limit = 50)", () => {
        expect(createPages(100, 50, 50)).to.eql([1, 2, null, 48, 49, 50]);
    });

    it("100 страниц и 70-я текущая (limit = 50)", () => {
        expect(createPages(100, 70, 50)).to.eql([1, 2, null, 68, 69, 70]);
    });
    it("5 страниц и 1-я текущая (limit = 50)", () => {
        expect(createPages(5, 1, 50)).to.eql([1, 2, 3, 4, 5]);
    });
    it("6 страниц и 1-я текущая (limit = 50)", () => {
        expect(createPages(6, 1, 50)).to.eql([1, 2, 3, null, 5, 6]);
    });
    it("6 страниц и 2-я текущая (limit = 50)", () => {
        expect(createPages(6, 2, 50)).to.eql([1, 2, 3, 4, 5, 6]);
    });
    it("4 страницы и 1-я текущая (limit = 50)", () => {
        expect(createPages(4, 1, 50)).to.eql([1, 2, 3, 4]);
    });
    it("3 страницы и 1-я текущая (limit = 50)", () => {
        expect(createPages(3, 1, 50)).to.eql([1, 2, 3]);
    });
    it("3 страницы и 2-я текущая (limit = 50)", () => {
        expect(createPages(3, 2, 50)).to.eql([1, 2, 3]);
    });
    it("3 страницы и 3-я текущая (limit = 50)", () => {
        expect(createPages(3, 3, 50)).to.eql([1, 2, 3]);
    });
});
