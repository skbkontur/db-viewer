import { storiesOf } from "@kadira/storybook";
import * as React from "react";
import { DatePicker, errorOnLostFocus, Input } from "Commons/ControlsWithValidation";
import { Form } from "Commons/Form/Form";

import { ValidationContainerWithSubmitButton } from "../StoryDecorators";
import { WithState } from "../WithState";

storiesOf(module)
    .addDecorator(ValidationContainerWithSubmitButton())
    .add("Обязательный инпут", () => (
        <Form>
            <Form.Section>
                <WithState initial={{ value: "value" }}>
                    {(state, onChange) => (
                        <Form.Row caption="Инпутик">
                            <Input value={state.value} required onChange={(_, value) => onChange({ value: value })} />
                        </Form.Row>
                    )}
                </WithState>
            </Form.Section>
        </Form>
    ))
    .add("Обязательный циферный инпут", () => (
        <Form>
            <Form.Section>
                <WithState initial={{ value: "value" }}>
                    {(state, onChange) => (
                        <Form.Row caption="Инпутик">
                            <Input
                                value={state.value}
                                required
                                validations={[
                                    errorOnLostFocus(v => /^\d*$/.test(v || ""), "Инпут должен содержать только цифры"),
                                ]}
                                onChange={(_, value) => onChange({ value: value })}
                            />
                        </Form.Row>
                    )}
                </WithState>
            </Form.Section>
        </Form>
    ))
    .add("Обязательный датапикер", () => (
        <Form>
            <Form.Section>
                <WithState initial={{ value: new Date() }}>
                    {(state, onChange) => (
                        <Form.Row caption="Дата пикер">
                            <DatePicker
                                value={state.value}
                                required
                                onChange={(_, value) => onChange({ value: value || undefined })}
                            />
                        </Form.Row>
                    )}
                </WithState>
            </Form.Section>
        </Form>
    ))
    .add("Обязательный чётный датапикер", () => (
        <Form>
            <Form.Section>
                <WithState initial={{ value: new Date() }}>
                    {(state, onChange) => (
                        <Form.Row caption="Дата пикер">
                            <DatePicker
                                value={state.value}
                                required
                                validations={[
                                    errorOnLostFocus(v => !v || v.getDate() % 2 === 0, "День должен быть чётный"),
                                ]}
                                onChange={(_, value) => onChange({ value: value || undefined })}
                            />
                        </Form.Row>
                    )}
                </WithState>
            </Form.Section>
        </Form>
    ));
