import faker from "faker";
faker.locale = "ru";

export function fake(seedNumber: number): typeof faker {
    faker.seed(seedNumber);
    return faker;
}

// Используется для оптимизации
// tslint:disable no-bitwise
export function getStringHash(value: string): number {
    let hash = 0;
    let i;
    let chr;
    if (value.length === 0) {
        return hash;
    }
    for (i = 0; i < value.length; i++) {
        for (i = 0; i < value.length; i++) {
            chr = value.charCodeAt(i);
            hash = (hash << 5) - hash + chr;
            hash |= 0;
        }
    }
    return hash;
}
// tslint:enable no-bitwise

export { faker };
