class OptionalChainingWrapper<T> {
    private readonly value?: T;

    private static readonly nullPattern = /^null | null$|^[^(]* null /i;
    private static readonly undefinedPattern = /^undefined | undefined$|^[^(]* undefined /i;

    public constructor(value?: T) {
        this.value = value;
    }

    public get(): undefined | T {
        return this.value;
    }

    public with<TR>(accessor: (value: OptianalChainingNotNull<T>) => TR): OptionalChainingWrapper<TR> {
        try {
            if (this.value == undefined) {
                return new OptionalChainingWrapper<TR>(undefined);
            }
            return new OptionalChainingWrapper<TR>(accessor(this.value as any));
        } catch (error) {
            if (error instanceof TypeError) {
                if (OptionalChainingWrapper.nullPattern.test(error.toString())) {
                    return new OptionalChainingWrapper<TR>(undefined);
                } else if (OptionalChainingWrapper.undefinedPattern.test(error.toString())) {
                    return new OptionalChainingWrapper<TR>(undefined);
                }
            }
            throw error;
        }
    }
}

export function op<T>(value?: T): OptionalChainingWrapper<T> {
    return new OptionalChainingWrapper<T>(value);
}

// tslint:disable:prettier
export type OptianalChainingNotNull<T> =
    T extends Nullable<string> ? string :
    T extends Nullable<number> ? number :
    T extends Nullable<string | Date> ? string | Date :
    {
        [P in keyof T]-?:
            T[P] extends Array<infer U> ? Array<OptianalChainingNotNull<U>> :
            T[P] extends ReadonlyArray<infer U> ? ReadonlyArray<OptianalChainingNotNull<U>> :
            T[P] extends Nullable<Array<infer U>> ? Array<OptianalChainingNotNull<U>> :
            T[P] extends Object ? OptianalChainingNotNull<NonNullable<T[P]>> :
            T[P]
    };
// tslint:enable:prettier
