import { storiesOf } from "@storybook/react";
import React from "react";
import StoryRouter from "storybook-react-router";

import { SchemaDescription } from "Domain/Api/SchemaDescription";

import { BusinessObjectTypes } from "../../src/Components/BusinessObjectTypes/BusinessObjectTypes";

import objects from "./Responses/business-objects.json";

const schema: SchemaDescription = {
    allowReadAll: true,
    schemaName: "ab",
    downloadLimit: 100,
    countLimit: 10,
};

storiesOf("BusinessObjectTypes", module)
    .addDecorator(StoryRouter())
    .add("Default", () => (
        <BusinessObjectTypes
            filter=""
            getPath={x => x}
            objects={[
                {
                    identifier: "table 1",
                    schemaDescription: schema,
                    typeMetaInformation: null,
                },
                {
                    identifier: "Table 3",
                    schemaDescription: schema,
                    typeMetaInformation: null,
                },
                {
                    identifier: "table 2",
                    schemaDescription: schema,
                    typeMetaInformation: null,
                },
            ]}
        />
    ))
    .add("EDI Objects", () => <BusinessObjectTypes filter="" getPath={x => x} objects={objects} />);
