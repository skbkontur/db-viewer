import { mount, ReactWrapper } from "enzyme";
import invariant from "invariant";
import { JSDOM } from "jsdom";

ReactWrapper.prototype.hackedSimulate = function(eventName) {
    const evt = new window.Event(eventName, { bubbles: true });
    this.node.dispatchEvent(evt);
};

export function createFakeApi(functions) {
    return functions
        .map(functionName => ({ [functionName]: createAsyncMockFunction() }))
        .reduce((x, y) => ({ ...x, ...y }));
}

export function mockClass(fn) {
    return Object.getOwnPropertyNames(Object.getPrototypeOf(fn)).reduce((mock, key) => {
        mock[key] = stubbedClassMethod;

        function stubbedClassMethod() {
            console.error(`${key} was called on mocked Object\n\n\n\n\n!!!!!!!!!`);
            invariant(false, `${key} was called on mocked Object`);
        }

        return mock;
    }, {});
}

function createAsyncMockFunction() {
    const mock = async function(...args) {
        mock.promise = new Promise((resolve, reject) => {
            mock.countCall++;
            mock.args = args;
            mock.resolve = resolve;
            mock.reject = reject;
        });
        return await mock.promise;
    };
    mock.countCall = 0;
    return mock;
}

export function nextTick() {
    return idle(0);
}

export function idle(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

export function mountIntoContent(node, options) {
    return mount(node, { attachTo: document.getElementById("content"), ...options });
}

export function dfd() {
    const deffered = {};
    deffered.promise = new Promise((res, rej) => {
        deffered.resolve = (...args) => setTimeout(() => res(...args), 0);
        deffered.reject = rej;
    });
    return deffered;
}

export function injectJsDomToGlobal() {
    const dom = new JSDOM("<!doctype html><html><body><div id=\"content\"></div></body></html>");
    global.window = dom.window;
    global.document = dom.window.document;
}

export function clearJsDomFromGlobal() {
    global.document = null;
    global.window = null;
}

export function resolvesAsync(expe, predefinedData) {
    const deffered = dfd();
    expe.returns(deffered.promise);
    return data => deffered.resolve(data || predefinedData);
}

export const oit = (...props) => it.only(...props);


export function injectFakeLocalStorage() {
    global.localStorage = {
        items: {},
        getItem(key: string) {
            return this.items[key];
        },
        setItem(key: string, value: string) {
            this.items[key] = value;
        },
    };
}

export function clearFakeLocalStorage() {
    global.localStorage = null;
}
