import { Selector, t } from "testcafe";

import { applyDataTidSelector } from "./ControlCommons.js";

export function Input(selector: string): InputControl {
    return new InputControl(applyDataTidSelector(selector));
}

class InputControl {
    root: Selector;
    innerInput: Selector;

    constructor(selector: string) {
        this.root = Selector(selector);
        this.innerInput = this.root.child("[data-comp-name='Input']").child("input");
    }

    async typeText(text: string): Promise<void> {
        return t.typeText(this.root, text);
    }

    async selectText(): Promise<void> {
        return t.selectText(this.innerInput);
    }

    async click(): Promise<void> {
        return t.click(this.innerInput);
    }

    async blur(): Promise<void> {
        return t.pressKey("tab");
    }

    get value(): ReExecutablePromise<?string> {
        return this.innerInput.value;
    }
}
