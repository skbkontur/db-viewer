import { action } from "@storybook/addon-actions";
import React from "react";

import { NullCustomRenderer } from "../../src";
import { renderForEdit } from "../../src/Components/ObjectViewer/ObjectItemRender";
import { PropertyMetaInformation } from "../../src/Domain/Api/DataTypes/PropertyMetaInformation";
import { TypeMetaInformation } from "../../src/Domain/Api/DataTypes/TypeMetaInformation";

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

export default {
    title: "ObjectEditableCustomRender",
};

export const String = (): React.ReactElement => (
    <div>
        {renderForEdit("value", { ...prop, type: { ...type, typeName: "String" } }, "Type", action("change"), renderer)}
    </div>
);

export const StringWithNullValue = (): React.ReactElement => (
    <div>
        {renderForEdit(null, { ...prop, type: { ...type, typeName: "String" } }, "Type", action("change"), renderer)}
    </div>
);

export const DateTime = (): React.ReactElement => (
    <div>
        {renderForEdit(
            new Date(),
            { ...prop, type: { ...type, typeName: "DateTime" } },
            "Type",
            action("change"),
            renderer
        )}
    </div>
);

export const Int32 = (): React.ReactElement => (
    <div>
        {renderForEdit("123", { ...prop, type: { ...type, typeName: "Int32" } }, "Type", action("change"), renderer)}
    </div>
);

export const Decimal = (): React.ReactElement => (
    <div>
        {renderForEdit(
            "123.12",
            { ...prop, type: { ...type, typeName: "Decimal" } },
            "Type",
            action("change"),
            renderer
        )}
    </div>
);

export const Boolean = (): React.ReactElement => (
    <div>
        {renderForEdit(false, { ...prop, type: { ...type, typeName: "Boolean" } }, "Type", action("change"), renderer)}
    </div>
);
