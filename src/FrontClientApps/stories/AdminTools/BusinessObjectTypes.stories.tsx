import { storiesOf } from "@kadira/storybook";
import React from "react";
import StoryRouter from "storybook-react-router";
import { BusinessObjectStorageType } from "Domain/EDI/Api/AdminTools/DataTypes/BusinessObjectStorageType";

import { BusinessObjectTypes } from "../../src/AdminTools/Components/BusinessObjectTypes/BusinessObjectTypes";

import objects from "./Responses/business-objects.json";

storiesOf(module)
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
