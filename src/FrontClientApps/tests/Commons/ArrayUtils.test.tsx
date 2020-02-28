import { expect } from "chai";

import { areEqual, groupByToArray } from "Commons/Utils/ArrayUtils";
import { ArgumentNullOrUndefinedError } from "Commons/Utils/Errors";

class TestNumberEqualityComparer {
    public static instance: TestNumberEqualityComparer;
    public equals(left: Nullable<number>, right: Nullable<number>): boolean {
        return left === right;
    }
    public getHashCode(value: Nullable<number>): number {
        if (value === null || value === undefined) {
            return 1000;
        }
        return value % 1000;
    }
}
TestNumberEqualityComparer.instance = new TestNumberEqualityComparer();

describe("groupByToArray", () => {
    it("должен выдавать сгруппированный массив", () => {
        expect(groupByToArray([1, 2, 3], TestNumberEqualityComparer.instance)).to.eql([[1], [2], [3]]);
    });

    it("должен для пустого массива выдавать пустой массив", () => {
        expect(groupByToArray([], TestNumberEqualityComparer.instance)).to.eql([]);
    });

    it("должен выдавать сгруппированный с одинаковыми элементами в одном массиве", () => {
        expect(groupByToArray([1, 1, 2, 3], TestNumberEqualityComparer.instance)).to.eql([[1, 1], [2], [3]]);
        expect(groupByToArray([0, null, undefined, 1, 1, 2, 3], TestNumberEqualityComparer.instance)).to.eql([
            [0],
            [null],
            [undefined],
            [1, 1],
            [2],
            [3],
        ]);
    });

    it("должен кидать исключения если аргументы нулевые", () => {
        expect(() => groupByToArray(null as any, TestNumberEqualityComparer.instance)).to.throw(
            ArgumentNullOrUndefinedError
        );
        expect(() => groupByToArray(undefined as any, TestNumberEqualityComparer.instance)).to.throw(
            ArgumentNullOrUndefinedError
        );
        expect(() => groupByToArray([], null as any)).to.throw(ArgumentNullOrUndefinedError);
        expect(() => groupByToArray([], undefined as any)).to.throw(ArgumentNullOrUndefinedError);
    });
});

describe("areEqual", () => {
    describe("массивы, содержащие простые типы", () => {
        it("значения не повторяются", () => {
            const first = [1, 2, 3];
            const second = [1, 2, 3];
            expect(areEqual<number>(first, second)).to.be.true;

            const third = [2, 3, 4];
            expect(areEqual<number>(first, third)).to.be.false;
        });

        it("значения повторяются", () => {
            const first = ["2", "2", "2", "3"];
            const second = ["2", "3", "2", "2"];
            expect(areEqual<string>(first, second)).to.be.true;

            const third = ["2", "3", "2", "3"];
            expect(areEqual<string>(first, third)).to.be.false;
        });

        it("массивы разной длины", () => {
            const first = [1000000000000, 200000000000, 3000000000];
            const second = [1000000000000, 200000000000, 3000000000, 3000000000];
            expect(areEqual<number>(first, second)).to.be.false;
        });

        it("не учитывается порядок элементов", () => {
            const first = [false, true, false];
            const second = [true, false, false];
            expect(areEqual<boolean>(first, second)).to.be.true;
        });
    });

    describe("массивы, содержащие сложные типы", () => {
        it("работает с объектами", () => {
            const first = [{ a: "5", c: "sdfg" }, { a: "asfg", c: "2435" }];
            const second = [{ a: "5", c: "sdfg" }, { a: "asfg", c: "2435" }];
            expect(areEqual<{ a: string; c: string }>(first, second)).to.be.true;
        });

        it("сортирует объекты по ключу", () => {
            const first = [{ a: "5", c: "sdfg" }, { a: "asfg", c: "2435" }];
            const second = [{ a: "asfg", c: "2435" }, { a: "5", c: "sdfg" }];
            expect(areEqual<{ a: string; c: string }>(first, second)).to.be.false;
            expect(areEqual<{ a: string; c: string }>(first, second, x => x.a)).to.be.true;
            expect(areEqual<{ a: string; c: string }>(first, second, x => x.c)).to.be.true;
        });
    });
});
