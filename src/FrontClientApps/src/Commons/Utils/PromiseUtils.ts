/**
 * packPromisesSequence - для последовательной обработки запросов
 */
export class PromiseSequence<T> {
    private sequence: Array<() => Promise<T>> = [];
    private promisesLoadFlag = false;

    public get length() {
        return this.sequence.length;
    }

    public addPromise(promiseFunc: () => Promise<T>) {
        this.sequence.push(promiseFunc);
    }

    public execute: () => Promise<any> = async () => {
        if (!this.promisesLoadFlag) {
            this.promisesLoadFlag = true;
            try {
                while (this.sequence.length) {
                    const promiseFunc = this.sequence.shift();
                    if (promiseFunc) {
                        await promiseFunc();
                    }
                }
                this.promisesLoadFlag = false;
                return Promise.resolve();
            } catch (e) {
                this.promisesLoadFlag = false;
                console.error(e);
                return this.execute();
            }
        }
    };

    public clear() {
        this.sequence = [];
    }
}

export type TakeLastAndRejectPreviousFunction<T extends Function> = T & { cancel(callback: () => void): void };

export function takeLastAndRejectPrevious<T extends Function>(func: T): any {
    // @ts-ignore
    const result = (...args) =>
        new Promise(async (resolve, reject) => {
            const currentRequest = result.requestIncrement++;
            result.lastRequestId = currentRequest;
            try {
                const functionResult = await func(...args);
                if (result.lastRequestId === currentRequest) {
                    result.lastRequestId = null;
                    if (result.hasCancel) {
                        result.hasCancel = false;
                    } else {
                        resolve(functionResult);
                    }
                }
            } catch (e) {
                if (result.lastRequestId === currentRequest) {
                    result.lastRequestId = null;
                    if (result.hasCancel) {
                        result.hasCancel = false;
                    } else {
                        reject(e);
                    }
                }
            }
        });
    result.hasCancel = false;
    result.requestIncrement = 0;
    // @ts-ignore
    result.lastRequestId = null;
    result.cancel = (finalizer: Function) => {
        if (result.lastRequestId != null && !result.hasCancel && typeof finalizer === "function") {
            finalizer();
        }
        result.hasCancel = true;
    };
    return result;
}

export function delay(timeout: number): Promise<void> {
    return new Promise(f => setTimeout(f, timeout));
}

export function nextTick(): Promise<void> {
    return delay(0);
}
