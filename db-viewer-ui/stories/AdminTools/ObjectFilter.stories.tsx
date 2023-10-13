import { action } from "@storybook/addon-actions";
import React from "react";

import { ObjectFilter } from "../../src/Components/ObjectFilter/ObjectFilter";
import { ValidationContainerWithSubmitButton } from "../StoryDecorators";

import Party2Metadata from "./Responses/Party2Metadata.json";

export default {
    title: "ObjectFilter",
    decorators: [ValidationContainerWithSubmitButton()],
};

export const Default = (): React.ReactElement => (
    <ObjectFilter
        conditions={[]}
        onChange={action("onChange")}
        tableColumns={Party2Metadata.typeMetaInformation.properties}
    />
);
