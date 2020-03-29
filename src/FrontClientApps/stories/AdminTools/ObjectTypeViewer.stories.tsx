import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { ObjectViewer } from "../../src/Components/ObjectViewer/ObjectViewer";
import { NullCustomRenderer } from "../../src/Domain/Objects/CustomRenderer";

import Ordrsp2MetaData from "./Responses/Ordrsp2MetaData.json";
import Ordrsp2Object from "./Responses/Ordrsp2Object.json";

storiesOf("ObjectTypeViewer", module)
    .add("Ordrsp2", () => (
        <ObjectViewer
            customRenderer={new NullCustomRenderer()}
            objectInfo={Ordrsp2Object}
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
            objectInfo={Ordrsp2Object}
            objectMeta={Ordrsp2MetaData}
            onChange={async () => {
                action("change");
            }}
            allowEdit={false}
        />
    ));
