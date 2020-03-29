import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { ObjectFilter } from "../../src/Components/ObjectFilter/ObjectFilter";
import { ValidationContainerWithSubmitButton } from "../StoryDecorators";

import Party2Metadata from "./Responses/Party2Metadata.json";

storiesOf("ObjectFilter", module)
    .addDecorator(ValidationContainerWithSubmitButton())
    .add("Default", () => (
        <ObjectFilter
            conditions={[]}
            onChange={action("onChange")}
            tableColumns={Party2Metadata.typeMetaInformation.properties}
        />
    ));
