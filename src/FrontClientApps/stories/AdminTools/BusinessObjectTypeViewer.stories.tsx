import { action, storiesOf } from "@kadira/storybook";
import React from "react";

import { BusinessObjectViewer } from "../../src/AdminTools/Components/BusinessObjectViewer/BusinessObjectViewer";

import Ordrsp2BusinessObject from "./Responses/Ordrsp2BusinessObject.json";
import Ordrsp2MetaData from "./Responses/Ordrsp2MetaData.json";

storiesOf(module)
    .add("Ordrsp2", () => (
        <BusinessObjectViewer
            objectInfo={Ordrsp2BusinessObject}
            objectMeta={Ordrsp2MetaData}
            onChange={action("change")}
            allowEdit
        />
    ))
    .add("Без редактирования", () => (
        <BusinessObjectViewer
            objectInfo={Ordrsp2BusinessObject}
            objectMeta={Ordrsp2MetaData}
            onChange={action("change")}
            allowEdit={false}
        />
    ));
