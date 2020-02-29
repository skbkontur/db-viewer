import Input from "@skbkontur/react-ui/Input";
import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Form, FormRow, FormSection } from "Commons/Form/Form";

storiesOf("Form", module)
    .add("SimpleForm", () => (
        <Form>
            <FormRow caption="Caption 1">
                <Input value="value" onChange={action("onChange")} />
            </FormRow>
            <FormRow caption="Caption 2">
                <Input value="value" onChange={action("onChange")} />
            </FormRow>
        </Form>
    ))
    .add("ColorOfCaptions", () => (
        <Form captionColor={"greyed"}>
            <FormRow caption="Caption 1">
                <Input value="value" onChange={action("onChange")} />
            </FormRow>
            <FormRow caption="Caption 2">
                <Input value="value" onChange={action("onChange")} />
            </FormRow>
        </Form>
    ))
    .add("WithHangingChars", () => (
        <Form captionColor={"greyed"} allowHangingChars>
            <FormRow caption="Caption 1">
                <Form.HangChar>с</Form.HangChar>
                <Input value="value" onChange={action("onChange")} />
            </FormRow>
            <FormRow caption="Caption 2">
                <Form.HangChar>№</Form.HangChar>
                <Input value="value" onChange={action("onChange")} />
            </FormRow>
            <FormRow caption="Caption 2">
                <Input value="value" onChange={action("onChange")} />
            </FormRow>
            <FormRow caption="Caption 2">
                <Form.HangChar>№</Form.HangChar>
                <Input value="value" onChange={action("onChange")} />
            </FormRow>
        </Form>
    ))
    .add("WithGap", () => (
        <Form gap={4}>
            <FormRow caption="Caption 1">
                <Input value="value" onChange={action("onChange")} />
            </FormRow>
            <FormRow caption="Caption 2">
                <Input value="value" onChange={action("onChange")} />
            </FormRow>
        </Form>
    ))
    .add("WithSection", () => (
        <Form>
            <FormRow caption="Caption 1">
                <Input value="value" onChange={action("onChange")} />
            </FormRow>
            <FormRow caption="Caption 2">
                <Input value="value" onChange={action("onChange")} />
            </FormRow>
            <FormSection title="Section title">
                <FormRow caption="In section caption">
                    <Input value="value" onChange={action("onChange")} />
                </FormRow>
            </FormSection>
            <FormRow caption="Not in section Caption">
                <Input value="value" onChange={action("onChange")} />
            </FormRow>
        </Form>
    ))
    .add("WithSectionAtTheTop", () => (
        <Form>
            <FormSection title="Section title (Это баг, верхнего поля, кажется, быть не должно)">
                <FormRow caption="In section caption">
                    <Input value="value" onChange={action("onChange")} />
                </FormRow>
            </FormSection>
            <FormRow caption="Not in section Caption">
                <Input value="value" onChange={action("onChange")} />
            </FormRow>
            <FormRow caption="Caption 1">
                <Input value="value" onChange={action("onChange")} />
            </FormRow>
            <FormRow caption="Caption 2">
                <Input value="value" onChange={action("onChange")} />
            </FormRow>
        </Form>
    ))
    .add("ElementInTopRightPosition", () => (
        <Form>
            <FormRow caption="Caption 1">
                <Input value="value" onChange={action("onChange")} />
            </FormRow>
            <FormSection
                title="Section title"
                renderElementInTopOfForm={() => (
                    <div style={{ position: "absolute", right: 0, top: 5 }}>I am in top right angle of section</div>
                )}>
                <FormRow caption="In section caption">
                    <Input value="value" onChange={action("onChange")} />
                </FormRow>
            </FormSection>
            <FormRow caption="Not in section Caption">
                <Input value="value" onChange={action("onChange")} />
            </FormRow>
            <FormRow caption="Caption 1">
                <Input value="value" onChange={action("onChange")} />
            </FormRow>
            <FormRow caption="Caption 2">
                <Input value="value" onChange={action("onChange")} />
            </FormRow>
        </Form>
    ))
    .add("without title and with element in top right position", () => (
        <Form>
            <FormRow caption="Caption 1">
                <Input value="value" onChange={action("onChange")} />
            </FormRow>
            <FormSection
                renderElementInTopOfForm={() => (
                    <div style={{ position: "absolute", right: 0, top: 5 }}>I am in top right angle of section</div>
                )}>
                <FormRow caption="In section caption">
                    <Input value="value" onChange={action("onChange")} />
                </FormRow>
            </FormSection>
            <FormRow caption="Not in section Caption">
                <Input value="value" onChange={action("onChange")} />
            </FormRow>
            <FormRow caption="Caption 1">
                <Input value="value" onChange={action("onChange")} />
            </FormRow>
            <FormRow caption="Caption 2">
                <Input value="value" onChange={action("onChange")} />
            </FormRow>
        </Form>
    ))
    .add("with big gap and with element in top right position", () => (
        <Form gap={10}>
            <FormRow caption="Caption 1">
                <Input value="value" onChange={action("onChange")} />
            </FormRow>
            <FormSection
                renderElementInTopOfForm={() => (
                    <div style={{ position: "absolute", right: 0, top: 5 }}>I am in top right angle of section</div>
                )}>
                <FormRow caption="In section caption">
                    <Input value="value" onChange={action("onChange")} />
                </FormRow>
            </FormSection>
            <FormRow caption="Not in section Caption">
                <Input value="value" onChange={action("onChange")} />
            </FormRow>
            <FormRow caption="Caption 1">
                <Input value="value" onChange={action("onChange")} />
            </FormRow>
            <FormRow caption="Caption 2">
                <Input value="value" onChange={action("onChange")} />
            </FormRow>
        </Form>
    ))
    .add("with custom render of title and with element in top right position", () => (
        <Form>
            <FormRow caption="Caption 1">
                <Input value="value" onChange={action("onChange")} />
            </FormRow>
            <FormSection
                renderTitle={() => <div style={{ width: 100, height: 100 }}>I am big title</div>}
                renderElementInTopOfForm={() => (
                    <div style={{ position: "absolute", right: 0, top: 0 }}>I am in top right angle of section</div>
                )}>
                <FormRow caption="In section caption">
                    <Input value="value" onChange={action("onChange")} />
                </FormRow>
            </FormSection>
            <FormRow caption="Not in section Caption">
                <Input value="value" onChange={action("onChange")} />
            </FormRow>
            <FormRow caption="Caption 1">
                <Input value="value" onChange={action("onChange")} />
            </FormRow>
            <FormRow caption="Caption 2">
                <Input value="value" onChange={action("onChange")} />
            </FormRow>
        </Form>
    ));
