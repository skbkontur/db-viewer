import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import React from "react";

import { BusinessObjectViewer } from "../../src/Components/BusinessObjectViewer/BusinessObjectViewer";

import Ordrsp2BusinessObject from "./Responses/Ordrsp2BusinessObject.json";
import Ordrsp2MetaData from "./Responses/Ordrsp2MetaData.json";

storiesOf("BusinessObjectTypeViewer", module)
    .add("Ordrsp2", () => (
        <BusinessObjectViewer
            objectInfo={Ordrsp2BusinessObject}
            objectMeta={Ordrsp2MetaData}
            onChange={async () => {
                action("change");
            }}
            allowEdit
        />
    ))
    .add("Без редактирования", () => (
        <BusinessObjectViewer
            objectInfo={Ordrsp2BusinessObject}
            objectMeta={Ordrsp2MetaData}
            onChange={async () => {
                action("change");
            }}
            allowEdit={false}
        />
    ));
