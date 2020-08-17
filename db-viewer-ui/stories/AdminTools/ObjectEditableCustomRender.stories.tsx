import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import React from "react";

import { renderForEdit } from "../../src/Components/ObjectViewer/ObjectItemRender";
import { PropertyMetaInformation } from "../../src/Domain/Api/DataTypes/PropertyMetaInformation";
import { TypeMetaInformation } from "../../src/Domain/Api/DataTypes/TypeMetaInformation";
import { NullCustomRenderer } from "../../src/Domain/Objects/CustomRenderer";

const type: TypeMetaInformation = {
    genericTypeArguments: [],
    isNullable: false,
    isArray: false,
    properties: [],
    typeName: "",
    originalTypeName: "",
};

const prop: PropertyMetaInformation = {
    name: "",
    isEditable: true,
    isIdentity: false,
    isSearchable: false,
    isSortable: false,
    isRequired: false,
    availableFilters: [],
    availableValues: [],
    type: type,
};

const renderer = new NullCustomRenderer();
storiesOf("ObjectEditableCustomRender", module)
    .add("String", () => (
        <div>
            {renderForEdit(
                "value",
                { ...prop, type: { ...type, typeName: "String" } },
                "Type",
                action("change"),
                renderer
            )}
        </div>
    ))
    .add("String with null value", () => (
        <div>
            {renderForEdit(
                null,
                { ...prop, type: { ...type, typeName: "String" } },
                "Type",
                action("change"),
                renderer
            )}
        </div>
    ))
    .add("DateTime", () => (
        <div>
            {renderForEdit(
                new Date(),
                { ...prop, type: { ...type, typeName: "DateTime" } },
                "Type",
                action("change"),
                renderer
            )}
        </div>
    ))
    .add("Int32", () => (
        <div>
            {renderForEdit(
                "123",
                { ...prop, type: { ...type, typeName: "Int32" } },
                "Type",
                action("change"),
                renderer
            )}
        </div>
    ))
    .add("Decimal", () => (
        <div>
            {renderForEdit(
                "123.12",
                { ...prop, type: { ...type, typeName: "Decimal" } },
                "Type",
                action("change"),
                renderer
            )}
        </div>
    ))
    .add("Boolean", () => (
        <div>
            {renderForEdit(
                false,
                { ...prop, type: { ...type, typeName: "Boolean" } },
                "Type",
                action("change"),
                renderer
            )}
        </div>
    ));
