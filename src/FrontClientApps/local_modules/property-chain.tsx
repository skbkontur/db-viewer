class CWrapper<T> {
    public value: T | null;

    public constructor(value: T | null = null) {
        this.value = value;
    }

    public with<U>(accessor: (x: T) => null | undefined | U): CWrapper<U> {
        if (this.value === null) {
            return new CWrapper();
        }
        const result = accessor(this.value);
        if (result == null) {
            return new CWrapper();
        }
        return new CWrapper(result);
    }

    public do(action: (x: T) => void): CWrapper<T> {
        if (this.value === null) {
            return new CWrapper();
        }
        action(this.value);
        return this;
    }

    public unless(condition: (x: T) => boolean): CWrapper<T> {
        if (this.value === null) {
            return new CWrapper();
        }
        if (!condition(this.value)) {
            return this;
        }
        return new CWrapper();
    }

    public if(condition: (x: T) => boolean): CWrapper<T> {
        if (this.value === null) {
            return new CWrapper();
        }
        if (condition(this.value)) {
            return this;
        }
        return new CWrapper();
    }

    public return(defaultValue: T): T;
    public return(defaultValue: null | T): null | T;
    public return(defaultValue: null | undefined | T): null | undefined | T;
    public return<TR>(defaultValue: TR): TR;
    public return(): null | T;
    public return(defaultValue?: any): any {
        if (this.value === null) {
            return defaultValue;
        }
        return this.value;
    }
}

export function $c<T>(value: null | undefined | T): CWrapper<T> {
    if (value == null) {
        return new CWrapper();
    }
    return new CWrapper(value);
}
