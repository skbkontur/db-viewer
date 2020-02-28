import { action, storiesOf } from "@kadira/storybook";
import React from "react";

import { BusinessObjectFilter } from "../../src/AdminTools/Components/BusinessObjectFilter/BusinessObjectFilter";
import { ValidationContainerWithSubmitButton } from "../StoryDecorators";

import Party2Metadata from "./Responses/Party2Metadata.json";

storiesOf(module)
    .addDecorator(ValidationContainerWithSubmitButton())
    .add("Default", () => (
        <BusinessObjectFilter
            conditions={[]}
            onChange={action("onChange")}
            tableColumns={Party2Metadata.typeMetaInformation.properties}
        />
    ));
