import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import React from "react";

import { customRenderForEdit } from "../../src/Components/BusinessObjectViewer/BusinessObjectItemCustomRender";

storiesOf("BusinessObjectEditableCustomRender", module)
    .add("String", () => <div>{customRenderForEdit("value", "String", action("change"))}</div>)
    .add("String with null value", () => <div>{customRenderForEdit(null, "String", action("change"))}</div>)
    .add("DateTime", () => <div>{customRenderForEdit(new Date(), "DateTime", action("change"))}</div>)
    .add("Int32", () => <div>{customRenderForEdit("123", "Int32", action("change"))}</div>)
    .add("Decimal", () => <div>{customRenderForEdit("123.12", "Decimal", action("change"))}</div>)
    .add("Boolean", () => <div>{customRenderForEdit(false, "Boolean", action("change"))}</div>);
