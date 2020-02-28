import { delay } from "Commons/Utils/PromiseUtils";

export { delay };

function lowercaseFirstLetter(word: string): string {
    return word[0].toLowerCase() + word.slice(1);
}

export function lowercaseObject(objectOrArray: any): any {
    if (Array.isArray(objectOrArray)) {
        const array = objectOrArray;
        return array.map(lowercaseObject);
    }
    if (typeof objectOrArray === "object") {
        const obj = objectOrArray;
        return Object.keys(obj).reduce((mem, key: string) => {
            mem[lowercaseFirstLetter(key)] = lowercaseObject(obj[key]);
            return mem;
        }, {});
    }
    return objectOrArray;
}

export function memoizeLast<T extends Function>(fn: T): T;
export function memoizeLast(fn: any): any {
    const memoized: any = (...args: any[]): any => {
        let hit = true;
        if (memoized.lastValues !== null) {
            for (let i = 0; i < memoized.lastValues.length; i++) {
                if (memoized.lastValues[i] !== args[i]) {
                    hit = false;
                    break;
                }
            }
            if (hit) {
                return memoized.lastResult;
            }
        }
        const result = fn(...args);
        memoized.lastValues = [...args];
        memoized.lastResult = result;
        return result;
    };
    memoized.lastValues = null;
    return memoized;
}

export function capitalizeFirstLetter(str?: string): string {
    if (str == null || str.length === 0) {
        return "";
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
}
