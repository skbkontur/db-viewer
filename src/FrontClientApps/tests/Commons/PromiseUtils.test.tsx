import { expect } from "chai";

import { PromiseSequence } from "Commons/Utils/PromiseUtils";

describe("PromiseUtils", () => {
    describe("PromiseSequence", () => {
        let promiseSequence: PromiseSequence<any>;

        beforeEach(() => {
            promiseSequence = new PromiseSequence();
        });

        it("должен зарезолвиться промис, добавляем функцию с промисом в очередь, выполняем", async () => {
            let testVal = 1;
            const promise = () =>
                new Promise((resolve, reject) => {
                    testVal = 5;
                    resolve(testVal);
                });
            promiseSequence.addPromise(promise);
            expect(testVal).to.eql(1);
            await promiseSequence.execute();
            expect(testVal).to.eql(5);
        });

        it("должна быть очередь из 5 ф-й с промисами", () => {
            for (let i = 0; i < 5; i++) {
                promiseSequence.addPromise(() => new Promise((resolve, reject) => i));
            }
            expect(promiseSequence.length).to.eql(5);
        });

        it("один из промисов в очереди упал, очередь должна продолжить выполняться", async () => {
            let resolvedCount = 0;
            for (let i = 0; i < 5; i++) {
                promiseSequence.addPromise(
                    () =>
                        new Promise((resolve, reject) => {
                            if (i === 3) {
                                reject(i);
                            } else {
                                resolvedCount++;
                                resolve(i);
                            }
                        })
                );
            }
            await promiseSequence.execute();
            expect(resolvedCount).to.be.eql(4);
        });

        it("один из промисов в очереди упал, останавливаем очередь", async () => {
            let resolvedCount = 0;
            for (let i = 0; i < 5; i++) {
                promiseSequence.addPromise(
                    () =>
                        new Promise((resolve, reject) => {
                            if (i === 3) {
                                reject(i);
                                promiseSequence.clear();
                            } else {
                                resolvedCount++;
                                resolve(i);
                            }
                        })
                );
            }
            await promiseSequence.execute();
            expect(resolvedCount).to.be.eql(3);
        });
    });
});
