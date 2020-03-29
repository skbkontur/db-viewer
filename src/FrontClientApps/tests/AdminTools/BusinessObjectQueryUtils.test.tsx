import { expect } from "chai";
import { suite, test } from "mocha-typescript";

import { Condition } from "../../src/Domain/Api/DataTypes/Condition";
import { ObjectFieldFilterOperator } from "../../src/Domain/Api/DataTypes/ObjectFieldFilterOperator";
import { ObjectFilterSortOrder } from "../../src/Domain/Api/DataTypes/ObjectFilterSortOrder";
import { Sort } from "../../src/Domain/Api/DataTypes/Sort";
import { ConditionsMapper, SortMapper } from "../../src/Domain/Objects/ObjectSearchQueryUtils";
import { QueryStringMapping } from "../../src/Domain/QueryStringMapping/QueryStringMapping";
import { QueryStringMappingBuilder } from "../../src/Domain/QueryStringMapping/QueryStringMappingBuilder";

interface ObjectSearchQuery {
    conditions: Nullable<Condition[]>;
    sort: Nullable<Sort>;
    count: Nullable<number>;
    offset: Nullable<number>;
    countLimit: Nullable<number>;
    hiddenColumns: Nullable<string[]>;
}

const mapper: QueryStringMapping<ObjectSearchQuery> = new QueryStringMappingBuilder<ObjectSearchQuery>()
    .mapToInteger(x => x.count, "count")
    .mapToInteger(x => x.offset, "offset")
    .mapToInteger(x => x.countLimit, "countLimit")
    .mapToStringArray(x => x.hiddenColumns, "hiddenColumns")
    .mapTo(x => x.sort, new SortMapper("sort"))
    .mapTo(x => x.conditions, new ConditionsMapper(["sort", "count", "offset", "hiddenColumns", "countLimit"]))
    .build();

class ObjectSearchQueryUtils {
    public static parse(search: Nullable<string>): ObjectSearchQuery {
        return mapper.parse(search);
    }

    public static stringify(query: Partial<ObjectSearchQuery>): Nullable<string> {
        return mapper.stringify({
            conditions: null,
            sort: null,
            count: null,
            offset: null,
            countLimit: null,
            hiddenColumns: null,
            ...query,
        });
    }
}

@suite
export class ObjectSearchQueryUtilsTest {
    @test
    public "должен парсить сортировку в простых случаях"() {
        expect(ObjectSearchQueryUtils.parse("?sort=path.to.object:asc")).to.eql({
            conditions: null,
            count: null,
            countLimit: null,
            offset: null,
            hiddenColumns: null,
            sort: {
                path: "path.to.object",
                sortOrder: "Ascending",
            },
        });
        expect(ObjectSearchQueryUtils.parse("?sort=path.to.object%3Aasc")).to.eql({
            conditions: null,
            count: null,
            countLimit: null,
            offset: null,
            hiddenColumns: null,
            sort: {
                path: "path.to.object",
                sortOrder: "Ascending",
            },
        });
        expect(ObjectSearchQueryUtils.parse("?sort=path.to.object")).to.eql({
            conditions: null,
            count: null,
            countLimit: null,
            offset: null,
            hiddenColumns: null,
            sort: {
                path: "path.to.object",
                sortOrder: "Descending",
            },
        });
        expect(ObjectSearchQueryUtils.parse("?sort=")).to.eql({
            conditions: null,
            count: null,
            countLimit: null,
            offset: null,
            hiddenColumns: null,
            sort: null,
        });
        expect(ObjectSearchQueryUtils.parse("?sort=  &a=1")).to.eql({
            conditions: [
                {
                    operator: "Equals",
                    path: "a",
                    value: "1",
                },
            ],
            count: null,
            countLimit: null,
            offset: null,
            hiddenColumns: null,
            sort: null,
        });
        expect(ObjectSearchQueryUtils.parse("?sort=x:1")).to.eql({
            conditions: null,
            count: null,
            countLimit: null,
            offset: null,
            hiddenColumns: null,
            sort: {
                path: "x",
                sortOrder: "Descending",
            },
        });
        expect(ObjectSearchQueryUtils.parse("?sort=:asc")).to.eql({
            conditions: null,
            count: null,
            countLimit: null,
            offset: null,
            hiddenColumns: null,
            sort: null,
        });
    }

    @test
    public "должен переводить в строку"() {
        expect(
            ObjectSearchQueryUtils.stringify({
                sort: {
                    path: "path.to.object",
                    sortOrder: ObjectFilterSortOrder.Ascending,
                },
                conditions: null,
            })
        ).to.eql("?sort=path.to.object%3Aasc");
        expect(
            ObjectSearchQueryUtils.stringify({
                sort: null,
                conditions: null,
            })
        ).to.eql("");
        expect(
            ObjectSearchQueryUtils.stringify({
                sort: {
                    path: null,
                    sortOrder: ObjectFilterSortOrder.Ascending,
                },
                conditions: null,
            })
        ).to.eql("");
    }

    @test
    public "должен парсить массив значений"() {
        expect(ObjectSearchQueryUtils.parse("?Box.Id=%3E123")).to.eql({
            conditions: [
                {
                    path: "Box.Id",
                    value: "123",
                    operator: ObjectFieldFilterOperator.GreaterThan,
                },
            ],
            count: null,
            countLimit: null,
            offset: null,
            hiddenColumns: null,
            sort: null,
        });
        expect(ObjectSearchQueryUtils.parse("?Box.Id=%3D123&Box.Gln=%3D456")).to.eql({
            conditions: [
                {
                    path: "Box.Id",
                    value: "123",
                    operator: ObjectFieldFilterOperator.Equals,
                },
                {
                    path: "Box.Gln",
                    value: "456",
                    operator: ObjectFieldFilterOperator.Equals,
                },
            ],
            count: null,
            countLimit: null,
            offset: null,
            hiddenColumns: null,
            sort: null,
        });
        expect(ObjectSearchQueryUtils.parse("?Box.Id=%3E123&Box.Gln=%3C321")).to.eql({
            conditions: [
                {
                    path: "Box.Id",
                    value: "123",
                    operator: ObjectFieldFilterOperator.GreaterThan,
                },
                {
                    path: "Box.Gln",
                    value: "321",
                    operator: ObjectFieldFilterOperator.LessThan,
                },
            ],
            sort: null,
            count: null,
            countLimit: null,
            offset: null,
            hiddenColumns: null,
        });
        expect(ObjectSearchQueryUtils.parse("?offset=20")).to.eql({
            count: null,
            countLimit: null,
            offset: 20,
            hiddenColumns: null,
            sort: null,
            conditions: null,
        });
        expect(
            ObjectSearchQueryUtils.parse(
                "?offset=20&count=100&sort=Box.Id:asc&Box.Id=%3E10&LastModificationDateTime=%3E%3D10"
            )
        ).to.eql({
            count: 100,
            countLimit: null,
            offset: 20,
            hiddenColumns: null,
            sort: {
                path: "Box.Id",
                sortOrder: "Ascending",
            },
            conditions: [
                {
                    path: "Box.Id",
                    value: "10",
                    operator: "GreaterThan",
                },
                {
                    path: "LastModificationDateTime",
                    value: "10",
                    operator: "GreaterThanOrEquals",
                },
            ],
        });
    }

    @test
    public "должен переводить в строку объект"() {
        expect(
            ObjectSearchQueryUtils.stringify({
                count: 100,
                offset: 20,
                sort: {
                    path: "Box.Id",
                    sortOrder: ObjectFilterSortOrder.Ascending,
                },
                conditions: [
                    {
                        path: "Box.Id",
                        value: "10",
                        operator: ObjectFieldFilterOperator.GreaterThan,
                    },
                    {
                        path: "LastModificationDateTime",
                        value: "10",
                        operator: ObjectFieldFilterOperator.GreaterThanOrEquals,
                    },
                ],
            })
        ).to.eql("?count=100&offset=20&sort=Box.Id%3Aasc&Box.Id=%3E10&LastModificationDateTime=%3E%3D10");
        expect(
            ObjectSearchQueryUtils.stringify({
                count: 20,
                offset: 1580,
                conditions: [
                    {
                        path: "Box.Gln",
                        value: "10",
                        operator: ObjectFieldFilterOperator.LessThan,
                    },
                    {
                        path: "LastModificationDateTime",
                        value: "13263165",
                        operator: ObjectFieldFilterOperator.LessThanOrEquals,
                    },
                ],
            })
        ).to.eql("?count=20&offset=1580&Box.Gln=%3C10&LastModificationDateTime=%3C%3D13263165");
    }
}
