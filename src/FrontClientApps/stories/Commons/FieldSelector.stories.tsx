import { action, storiesOf } from "@kadira/storybook";
import * as React from "react";

import { FieldSelector } from "../../src/AdminTools/Components/FieldSelector/FieldSelector";

storiesOf(module)
    .add("Простой случай", () => (
        <FieldSelector
            hiddenFields={[]}
            fieldDefinitions={[{ name: "name1", caption: "Name 1" }, { name: "name2", caption: "Name 2" }]}
            onShowField={action("onShowField")}
            onHideField={action("onHideField")}
        />
    ))
    .add("Длинные строки", () => (
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
    ))
    .add("Много элементов", () => (
        <FieldSelector
            hiddenFields={[]}
            fieldDefinitions={Array.from({ length: 40 }, (_, index) => ({
                name: `name${index}`,
                caption: `caption-${index}`,
            }))}
            onShowField={action("onShowField")}
            onHideField={action("onHideField")}
        />
    ))
    .add("Много элементов c длинными строками", () => (
        <FieldSelector
            hiddenFields={[]}
            fieldDefinitions={Array.from({ length: 40 }, (_, index) => ({
                name: `name${index}`,
                caption:
                    index % 13 === 0
                        ? `Long Long Long Long Long Long Long Long Long caption-${index}`
                        : `caption-${index}`,
            }))}
            onShowField={action("onShowField")}
            onHideField={action("onHideField")}
        />
    ));
