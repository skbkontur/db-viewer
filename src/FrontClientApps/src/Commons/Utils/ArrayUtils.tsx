import _ from "lodash";

import { Argument } from "./Argument";

export interface IComparer<T> {
    equals(left: T, right: T): boolean;
    getHashCode(value: T): number;
}

export function groupByToArray<T>(items: T[], comparer: IComparer<T>): T[][] {
    Argument.shouldBeNotNullOrUndefined(items, "items");
    Argument.shouldBeNotNullOrUndefined(comparer, "comparer");

    const result: T[][] = [];
    const indices: number[] = [];
    for (let i = 0; i < items.length; i++) {
        if (indices.includes(i)) {
            continue;
        }
        const currentGroup: T[] = [items[i]];
        indices.push(i);
        for (let nextIndex = i + 1; nextIndex < items.length; nextIndex++) {
            if (comparer.equals(items[i], items[nextIndex])) {
                if (indices.includes(nextIndex)) {
                    continue;
                }
                currentGroup.push(items[nextIndex]);
                indices.push(nextIndex);
            }
        }
        result.push(currentGroup);
    }
    return result;
}

type sortByFunc<T> = (x: T) => T[keyof T];

export function areEqual<T>(first: T[], second: T[], sortBy?: sortByFunc<T>): boolean {
    if (first.length !== second.length) {
        return false;
    }

    const defaultSortBy = (x: T) => x;
    const firstSorted = _.sortBy(first, [sortBy || defaultSortBy]);
    const secondSorted = _.sortBy(second, [sortBy || defaultSortBy]);
    return _.isEqual(firstSorted, secondSorted);
}
