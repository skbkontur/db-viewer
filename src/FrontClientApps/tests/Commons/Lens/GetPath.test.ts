import { expect } from "chai";
import { suite, test } from "mocha-typescript";

import { getPath, idx } from "Domain/lens";

interface X1 {
    p1: string;
}

interface X2 {
    c1: {
        p1: string;
    };
}

@suite
export class GetPathTest {
    @test
    public "get simple property"() {
        const path = getPath<X1, any>(x => x.p1);
        expect(path).to.eql(["p1"]);
    }

    @test
    public "get root"() {
        const path = getPath<X1, any>(x => x);
        expect(path).to.eql([]);
    }

    @test
    public "get nested value"() {
        const path = getPath<X2, any>(x => x.c1.p1);
        expect(path).to.eql(["c1", "p1"]);
    }

    @test
    public "get with idx functions"() {
        const path = getPath<X2, any>(x => idx(x, y => x.c1.p1));
        expect(path).to.eql(["c1", "p1"]);
    }

    @test
    public "check valid function"() {
        function makeSomeCall() {
            // just for test
        }

        expect(() => getPath<X2, any>(x => makeSomeCall())).throws;
    }
}
