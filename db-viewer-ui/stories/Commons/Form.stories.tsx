import { ColumnStack } from "@skbkontur/react-stack-layout";
import { Input } from "@skbkontur/react-ui";
import { action } from "@storybook/addon-actions";
import React from "react";

import { FormRow } from "../../src/Components/FormRow/FormRow";

export default {
    title: "Form",
};

export const Default = (): React.ReactElement => (
    <ColumnStack gap={2}>
        <FormRow caption="Caption 1">
            <Input value="value" onChange={action("onChange")} />
        </FormRow>
        <FormRow caption="Caption 2">
            <Input value="value" onChange={action("onChange")} />
        </FormRow>
    </ColumnStack>
);
