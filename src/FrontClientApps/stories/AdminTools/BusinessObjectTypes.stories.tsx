import { storiesOf } from "@storybook/react";
import React from "react";
import StoryRouter from "storybook-react-router";
import { BusinessObjectStorageType } from "Domain/Api/DataTypes/BusinessObjectStorageType";

import { BusinessObjectTypes } from "../../src/Components/BusinessObjectTypes/BusinessObjectTypes";

import objects from "./Responses/business-objects.json";

storiesOf("BusinessObjectTypes", module)
    .addDecorator(StoryRouter())
    .add("Default", () => (
        <BusinessObjectTypes
            filter=""
            getPath={x => x}
            objects={[
                {
                    identifier: "table 1",
                    mySqlTableName: null,
                    storageType: BusinessObjectStorageType.SingleObjectPerRow,
                    typeMetaInformation: null,
                },
                {
                    identifier: "Table 3",
                    mySqlTableName: null,
                    storageType: BusinessObjectStorageType.SingleObjectPerRow,
                    typeMetaInformation: null,
                },
                {
                    identifier: "table 2",
                    mySqlTableName: null,
                    storageType: BusinessObjectStorageType.SingleObjectPerRow,
                    typeMetaInformation: null,
                },
            ]}
        />
    ))
    .add("EDI Objects", () => <BusinessObjectTypes filter="" getPath={x => x} objects={objects} />);
