import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import React from "react";

import { BusinessObjectFilter } from "../../src/Components/BusinessObjectFilter/BusinessObjectFilter";
import { ValidationContainerWithSubmitButton } from "../StoryDecorators";

import Party2Metadata from "./Responses/Party2Metadata.json";

storiesOf("BusinessObjectFilter", module)
    .addDecorator(ValidationContainerWithSubmitButton())
    .add("Default", () => (
        <BusinessObjectFilter
            conditions={[]}
            onChange={action("onChange")}
            tableColumns={Party2Metadata.typeMetaInformation.properties}
        />
    ));
