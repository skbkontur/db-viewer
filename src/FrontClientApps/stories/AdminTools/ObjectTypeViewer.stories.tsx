import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { ObjectViewer } from "../../src/Components/ObjectViewer/ObjectViewer";
import { NullCustomRenderer } from "../../src/Domain/BusinessObjects/CustomRenderer";

import Ordrsp2BusinessObject from "./Responses/Ordrsp2BusinessObject.json";
import Ordrsp2MetaData from "./Responses/Ordrsp2MetaData.json";

storiesOf("BusinessObjectTypeViewer", module)
    .add("Ordrsp2", () => (
        <ObjectViewer
            customRenderer={new NullCustomRenderer()}
            objectInfo={Ordrsp2BusinessObject}
            objectMeta={Ordrsp2MetaData}
            onChange={async () => {
                action("change");
            }}
            allowEdit
        />
    ))
    .add("Без редактирования", () => (
        <ObjectViewer
            customRenderer={new NullCustomRenderer()}
            objectInfo={Ordrsp2BusinessObject}
            objectMeta={Ordrsp2MetaData}
            onChange={async () => {
                action("change");
            }}
            allowEdit={false}
        />
    ));
