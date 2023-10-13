import { action } from "@storybook/addon-actions";
import React from "react";

import { FieldSelector } from "../../src/Components/FieldSelector/FieldSelector";

export default {
    title: "FieldSelector",
};

export const Default = (): React.ReactElement => (
    <FieldSelector
        hiddenFields={[]}
        fieldDefinitions={[
            { name: "name1", caption: "Name 1" },
            { name: "name2", caption: "Name 2" },
        ]}
        onShowField={action("onShowField")}
        onHideField={action("onHideField")}
    />
);

export const LongStrings = (): React.ReactElement => (
    <FieldSelector
        hiddenFields={[]}
        fieldDefinitions={[
            { name: "name1", caption: "Name 1" },
            { name: "name2", caption: "Long Long Long Long Long Long Name 2" },
            { name: "name2", caption: "Name 2" },
            { name: "name2", caption: "Name 2" },
        ]}
        onShowField={action("onShowField")}
        onHideField={action("onHideField")}
    />
);

export const ManyElements = (): React.ReactElement => (
    <FieldSelector
        hiddenFields={[]}
        fieldDefinitions={Array.from({ length: 40 }, (_, index) => ({
            name: `name${index}`,
            caption: `caption-${index}`,
        }))}
        onShowField={action("onShowField")}
        onHideField={action("onHideField")}
    />
);

export const ManyElementsWithLongStrings = (): React.ReactElement => (
    <FieldSelector
        hiddenFields={[]}
        fieldDefinitions={Array.from({ length: 40 }, (_, index) => ({
            name: `name${index}`,
            caption:
                index % 13 === 0 ? `Long Long Long Long Long Long Long Long Long caption-${index}` : `caption-${index}`,
        }))}
        onShowField={action("onShowField")}
        onHideField={action("onHideField")}
    />
);
