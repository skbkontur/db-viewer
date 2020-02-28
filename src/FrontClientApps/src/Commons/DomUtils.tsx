export interface ISubscription {
    remove(): void;
    emit(): void;
}

class Subscription<T extends Function> implements ISubscription {
    public handler: T;
    public removeAction: (x0: T) => void;

    public constructor(handler: T, removeAction: (x0: T) => void) {
        this.handler = handler;
        this.removeAction = removeAction;
    }

    public emit() {
        this.handler({});
    }

    public remove() {
        if (this.handler != null) {
            this.removeAction(this.handler);
        }
        const index = subscriptions.indexOf(this);
        subscriptions.splice(index, 1);
    }
}

const subscriptions: ISubscription[] = [];

export class LayoutEvents {
    public static listenScroll(handler: (event: Event) => void): ISubscription {
        window.addEventListener("scroll", handler);
        const subscription = new Subscription(handler, x => window.removeEventListener("scroll", x));
        subscriptions.push(subscription);
        return subscription;
    }

    public static emit() {
        for (const subscription of subscriptions) {
            subscription.emit();
        }
    }
}

interface ComputedStyleResult {
    paddingLeft?: Nullable<string>;
    paddingRight?: Nullable<string>;
}

export class WindowUtils {
    public static getComputedStyle(element: Element): ComputedStyleResult {
        return window.getComputedStyle(element) || {};
    }

    public static getElementByIdToRenderApp(elementId: string): HTMLElement {
        const result = document.getElementById(elementId);
        if (result == null) {
            throw new Error(`Cannot render react application. Target element not found (#${elementId})`);
        }
        return result;
    }
}
