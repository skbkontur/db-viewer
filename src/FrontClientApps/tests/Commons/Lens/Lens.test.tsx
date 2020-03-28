import { expect } from "chai";
import { suite, test } from "mocha-typescript";

import { idx, pathLens, set, view } from "../../../src/Domain/lens";

interface X1 {
    p1: string;
}

interface X2 {
    c1: {
        p1: string;
    };
}

interface X3 {
    c1?: Nullable<{
        p1: Nullable<string>;
    }>;
}

@suite
export class LensTest {
    @test
    public "get simple property"() {
        const lens = pathLens<X1, any>(x => x.p1);
        const target: X1 = { p1: "1" };
        expect(view(lens, target)).to.eql("1");
    }

    @test
    public "get by path"() {
        const lens = pathLens<X2, any>(x => x.c1.p1);
        const target: X2 = { c1: { p1: "1" } };
        expect(view(lens, target)).to.eql("1");
    }

    @test
    public "set by path"() {
        const lens = pathLens<X2, any>(x => x.c1.p1);
        const target: X2 = { c1: { p1: "1" } };
        expect(set(lens, "2", target)).to.eql({ c1: { p1: "2" } });
    }

    @test
    public "set by path with null"() {
        const lens = pathLens<X3, any>(x => idx(x, (y: any) => y.c1.p1));
        const target: X3 = { c1: null };
        expect(set(lens, "2", target)).to.eql({ c1: { p1: "2" } });
    }

    @test
    public "check not mutate target"() {
        const lens = pathLens<X2, any>(x => x.c1.p1);
        const target: X2 = { c1: { p1: "1" } };
        const newTarget = set(lens, "2", target);
        expect(newTarget !== target).to.eql(true);
        expect(target.c1.p1).to.eql("1");
    }

    @test
    public "set by path with nulls"() {
        const lens = pathLens<X3, any>(x => idx(x, (y: any) => y.c1.p1));
        const target: X3 = {};
        expect(set(lens, "2", target)).to.eql({ c1: { p1: "2" } });
    }
}
