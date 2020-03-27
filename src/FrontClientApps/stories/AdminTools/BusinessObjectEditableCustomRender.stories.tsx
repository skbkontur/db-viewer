import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import React from "react";

import { customRenderForEdit } from "../../src/Components/BusinessObjectViewer/BusinessObjectItemCustomRender";

const prop = {
    name: "",
    isIdentity: false,
    isSearchable: false,
    isSortable: false,
    isRequired: false,
};

storiesOf("BusinessObjectEditableCustomRender", module)
    .add("String", () => <div>{customRenderForEdit("value", { ...prop, type: "String" }, action("change"))}</div>)
    .add("String with null value", () => (
        <div>{customRenderForEdit(null, { ...prop, type: "String" }, action("change"))}</div>
    ))
    .add("DateTime", () => (
        <div>{customRenderForEdit(new Date(), { ...prop, type: "DateTime" }, action("change"))}</div>
    ))
    .add("Int32", () => <div>{customRenderForEdit("123", { ...prop, type: "Int32" }, action("change"))}</div>)
    .add("Decimal", () => <div>{customRenderForEdit("123.12", { ...prop, type: "Decimal" }, action("change"))}</div>)
    .add("Boolean", () => <div>{customRenderForEdit(false, { ...prop, type: "Boolean" }, action("change"))}</div>);
