import { action } from "@storybook/addon-actions";
import React from "react";

import { NullCustomRenderer } from "../../src";
import { ObjectViewer } from "../../src/Components/ObjectViewer/ObjectViewer";

import Ordrsp2MetaData from "./Responses/Ordrsp2MetaData.json";
import Ordrsp2Object from "./Responses/Ordrsp2Object.json";

export default {
    title: "ObjectTypeViewer",
};

export const Ordrsp2 = (): React.ReactElement => (
    <ObjectViewer
        customRenderer={new NullCustomRenderer()}
        objectInfo={Ordrsp2Object}
        objectMeta={Ordrsp2MetaData}
        onChange={async () => {
            action("change");
        }}
        allowEdit
    />
);

export const WithoutEditing = (): React.ReactElement => (
    <ObjectViewer
        customRenderer={new NullCustomRenderer()}
        objectInfo={Ordrsp2Object}
        objectMeta={Ordrsp2MetaData}
        onChange={async () => {
            action("change");
        }}
        allowEdit={false}
    />
);
