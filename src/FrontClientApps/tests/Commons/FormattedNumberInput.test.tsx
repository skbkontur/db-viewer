import { expect } from "chai";
import { mount, ReactWrapper } from "edi-enzyme";
import { suite, test, timeout } from "mocha-typescript";
import * as React from "react";
import { spy, Spy1 } from "sinon";
import { FormattedNumberInput } from "Commons/FormattedNumberInput/FormattedNumberInput";

import { clearJsDomFromGlobal, injectJsDomToGlobal } from "../helper_functions";

interface InputProps {
    value: string;
}

function getInnerInput<T>(wrapper: ReactWrapper<T>): ReactWrapper<InputProps> {
    return wrapper.find("input") as any;
}

function simulateChangeOnInnerInput<T>(wrapper: ReactWrapper<T>, value: Nullable<string>) {
    getInnerInput(wrapper).simulate("change", { target: { value: value } });
}

function simulateType<T>(wrapper: ReactWrapper<T>, valueToType: string) {
    let currentlyTypedString = "";
    for (const currentChar of valueToType) {
        currentlyTypedString += currentChar;
        simulateChangeOnInnerInput(wrapper, currentlyTypedString);
        if (currentlyTypedString.indexOf(".") === -1) {
            expect(getInnerInput(wrapper).props().value).to.equal(`${currentlyTypedString}.0`);
        } else {
            expect(getInnerInput(wrapper).props().value).to.equal(currentlyTypedString);
        }
    }
}

@suite("<FormattedNumberInput />")
export class FormattedNumberInputTest {
    private readonly wrappers: Array<ReactWrapper<any>> = [];

    public before() {
        injectJsDomToGlobal();
    }

    public after() {
        for (const wrapper of this.wrappers) {
            wrapper.unmount();
        }
        clearJsDomFromGlobal();
    }

    @test
    public "должен содежать Input"() {
        const changeSpy: Spy1<Nullable<number>, void> = spy<Nullable<number>, void>();
        const wrapper = this.createWrapper(changeSpy, 1);
        expect(getInnerInput(wrapper)).to.have.length(1);
    }

    // первый simulate работает долго
    @timeout(10000)
    public "должен возвращать число"() {
        const changeSpy: Spy1<Nullable<number>, void> = spy<Nullable<number>, void>();
        const wrapper = this.createWrapper(changeSpy, 1);
        getInnerInput(wrapper).simulate("focus");
        simulateChangeOnInnerInput(wrapper, "2");
        expect(changeSpy.callCount).to.be.equal(1);
        expect(changeSpy.args[0][0]).to.equal(2);
    }

    @test
    public "должен возвращать число введеное с терминирующей точкой"() {
        const changeSpy: Spy1<Nullable<number>, void> = spy<Nullable<number>, void>();
        const wrapper = this.createWrapper(changeSpy, 1);
        getInnerInput(wrapper).simulate("focus");
        simulateChangeOnInnerInput(wrapper, "2.");
        expect(changeSpy.calledOnce).to.be.true;
        expect(changeSpy.args[0][0]).to.equal(2);
    }

    @test
    public "должен не давать печатать буквы"() {
        const changeSpy: Spy1<Nullable<number>, void> = spy<Nullable<number>, void>();
        const wrapper = this.createWrapper(changeSpy, 1);
        getInnerInput(wrapper).simulate("change", { target: { value: "2" } }, "2");
        expect(getInnerInput(wrapper).props().value).to.equal("2.0");
        simulateChangeOnInnerInput(wrapper, "2a");
        expect(getInnerInput(wrapper).props().value).to.equal("2.0");
        expect(changeSpy.callCount).to.equal(1);
        expect(changeSpy.args[0][0]).to.equal(2.0);
    }

    @test
    public "должен не давать вводить не число"() {
        const changeSpy: Spy1<Nullable<number>, void> = spy<Nullable<number>, void>();
        const wrapper = this.createWrapper(changeSpy, 1);
        simulateChangeOnInnerInput(wrapper, "not a number");
        expect(getInnerInput(wrapper).props().value).to.equal("1.0");
        expect(changeSpy.callCount).to.equal(0);
    }

    @test
    public "должен не давать вводить только пробелы"() {
        const changeSpy: Spy1<Nullable<number>, void> = spy<Nullable<number>, void>();
        const wrapper = this.createWrapper(changeSpy, 1);
        simulateChangeOnInnerInput(wrapper, " ");
        expect(getInnerInput(wrapper).props().value).to.equal("");
        expect(changeSpy.callCount).to.equal(1);
        expect(changeSpy.args[0][0]).to.equal(null);
    }

    @test
    public "должен позволять вводить числа в точкой"() {
        const changeSpy: Spy1<Nullable<number>, void> = spy<Nullable<number>, void>();
        const wrapper = this.createWrapper(changeSpy, 1);
        simulateType(wrapper, "2.1");
        expect(changeSpy.callCount).to.equal(3);
        expect(changeSpy.args[0][0]).to.equal(2.0);
        expect(changeSpy.args[1][0]).to.equal(2.0);
        expect(changeSpy.args[2][0]).to.equal(2.1);
    }

    @test
    public "должен позволять вводить отрицательные числа"() {
        const changeSpy: Spy1<Nullable<number>, void> = spy<Nullable<number>, void>();
        const originalValue = null;
        const wrapper = this.createWrapper(changeSpy, originalValue, null, null, true);
        simulateChangeOnInnerInput(wrapper, "-2.1");
        expect(changeSpy.callCount).to.equal(1);
        expect(changeSpy.args[0][0]).to.equal(-2.1);
    }

    @test
    public 'должен сбрасывать "-" на blur'() {
        const changeSpy: Spy1<Nullable<number>, void> = spy<Nullable<number>, void>();
        const originalValue = null;
        const wrapper = this.createWrapper(changeSpy, originalValue, null, null, true);
        simulateChangeOnInnerInput(wrapper, "-");
        expect(changeSpy.callCount).to.equal(1);
        expect(changeSpy.args[0][0]).to.equal(0.0);
    }

    @test
    public "должен позволять стирать числа и возвращать при этом null"() {
        const changeSpy: Spy1<Nullable<number>, void> = spy<Nullable<number>, void>();
        const wrapper = this.createWrapper(changeSpy, 1);

        simulateType(wrapper, "2.1");
        simulateChangeOnInnerInput(wrapper, "");
        expect(getInnerInput(wrapper).props().value).to.equal("");

        expect(changeSpy.callCount).to.equal(4);
        expect(changeSpy.args[0][0]).to.equal(2.0);
        expect(changeSpy.args[1][0]).to.equal(2.0);
        expect(changeSpy.args[2][0]).to.equal(2.1);
        expect(changeSpy.args[3][0]).to.equal(null);
    }

    @test
    public "должен делать реформат на blur"() {
        const changeSpy: Spy1<Nullable<number>, void> = spy<Nullable<number>, void>();
        const wrapper = this.createWrapper(changeSpy, 1, "0.0");

        simulateType(wrapper, "2.1");
        getInnerInput(wrapper).simulate("blur", {});
        expect(getInnerInput(wrapper).props().value).to.equal("2.1");

        expect(changeSpy.callCount).to.equal(4);
    }

    @test
    public "должен форматить во viewFormat на старте"() {
        const changeSpy: Spy1<Nullable<number>, void> = spy<Nullable<number>, void>();
        const wrapper = this.createWrapper(changeSpy, 1002.02, "0.000", "0,0.000");
        expect(getInnerInput(wrapper).props().value).to.equal("1 002.020");
    }

    @test
    public "должен делать реформат viewFormat на blur"() {
        const changeSpy: Spy1<Nullable<number>, void> = spy<Nullable<number>, void>();
        const wrapper = this.createWrapper(changeSpy, 1, "0.000", "0,0.000");

        simulateChangeOnInnerInput(wrapper, "1002.1");
        getInnerInput(wrapper).simulate("blur");
        expect(getInnerInput(wrapper).props().value).to.equal("1 002.100");
        getInnerInput(wrapper).simulate("focus");
        expect(getInnerInput(wrapper).props().value).to.equal("1002.100");

        expect(changeSpy.callCount).to.equal(2);
    }

    private createWrapper(
        onChange: (value: Nullable<number>) => void,
        value: Nullable<number>,
        editFormat: Nullable<string> = null,
        viewFormat: Nullable<string> = null,
        allowNegativeValue: boolean = false
    ): ReactWrapper<any> {
        const wrapper = mount(
            <FormattedNumberInput
                onChange={(e, nextValue) => {
                    wrapper.setProps({ value: nextValue });
                    onChange(nextValue);
                }}
                value={value}
                editFormat={editFormat}
                viewFormat={viewFormat}
                allowNegativeValue={allowNegativeValue}
            />
        );
        this.wrappers.push(wrapper);
        return wrapper;
    }
}
