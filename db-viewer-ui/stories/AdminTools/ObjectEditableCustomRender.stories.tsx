import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import React from "react";

import { renderForEdit } from "../../src/Components/ObjectViewer/ObjectItemRender";
import { NullCustomRenderer } from "../../src/Domain/Objects/CustomRenderer";

const prop = {
    name: "",
    isIdentity: false,
    isSearchable: false,
    isSortable: false,
    isRequired: false,
};

const renderer = new NullCustomRenderer();
storiesOf("ObjectEditableCustomRender", module)
    .add("String", () => (
        <div>{renderForEdit("value", { ...prop, type: "String" }, "Type", action("change"), renderer)}</div>
    ))
    .add("String with null value", () => (
        <div>{renderForEdit(null, { ...prop, type: "String" }, "Type", action("change"), renderer)}</div>
    ))
    .add("DateTime", () => (
        <div>{renderForEdit(new Date(), { ...prop, type: "DateTime" }, "Type", action("change"), renderer)}</div>
    ))
    .add("Int32", () => (
        <div>{renderForEdit("123", { ...prop, type: "Int32" }, "Type", action("change"), renderer)}</div>
    ))
    .add("Decimal", () => (
        <div>{renderForEdit("123.12", { ...prop, type: "Decimal" }, "Type", action("change"), renderer)}</div>
    ))
    .add("Boolean", () => (
        <div>{renderForEdit(false, { ...prop, type: "Boolean" }, "Type", action("change"), renderer)}</div>
    ));
