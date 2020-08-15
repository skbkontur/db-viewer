import { storiesOf } from "@storybook/react";
import React from "react";
import StoryRouter from "storybook-react-router";

import { ObjectTable } from "../../src/Components/ObjectTable/ObjectTable";
import { ObjectFieldFilterOperator } from "../../src/Domain/Api/DataTypes/ObjectFieldFilterOperator";
import { ObjectFilterSortOrder } from "../../src/Domain/Api/DataTypes/ObjectFilterSortOrder";
import { PropertyMetaInformation } from "../../src/Domain/Api/DataTypes/PropertyMetaInformation";
import { TypeMetaInformation } from "../../src/Domain/Api/DataTypes/TypeMetaInformation";
import { NullCustomRenderer } from "../../src/Domain/Objects/CustomRenderer";

async function deleteObject(_index: number): Promise<void> {
    // Ничего не делаем
}

export function emptyMethod() {
    // fake method
}

const string: TypeMetaInformation = {
    typeName: "String",
    originalTypeName: "String",
    properties: [],
    isArray: false,
    isNullable: false,
    genericTypeArguments: [],
};

const nonIndexed: PropertyMetaInformation = {
    name: "name",
    type: string,
    isEditable: true,
    isSortable: false,
    isSearchable: false,
    isRequired: false,
    isIdentity: false,
    availableFilters: [],
    availableValues: [],
};

const indexed: PropertyMetaInformation = {
    name: "name",
    type: string,
    isEditable: true,
    isSortable: false,
    isSearchable: false,
    isRequired: false,
    isIdentity: false,
    availableFilters: [ObjectFieldFilterOperator.Equals, ObjectFieldFilterOperator.DoesNotEqual],
    availableValues: [],
};

storiesOf("ObjectTable", module)
    .addDecorator(StoryRouter() as any)
    .add("Default", () => (
        <ObjectTable
            items={[{ id: { gln: "2125215-151256125-12521" }, lastEditedTime: "12521512521", boxId: "12365126126" }]}
            properties={[
                { ...nonIndexed, name: "id.gln" },
                { ...nonIndexed, name: "boxId" },
                { ...indexed, name: "lastEditedTime", isSortable: true },
            ]}
            onDetailsClick={() => "scopeId/id"}
            onChangeSortClick={emptyMethod}
            objectType="Type"
            customRenderer={new NullCustomRenderer()}
            onDeleteClick={deleteObject}
            currentSorts={[{ path: "BoxId", sortOrder: ObjectFilterSortOrder.Descending }]}
            allowDelete
        />
    ))
    .add("Без удаления", () => (
        <ObjectTable
            items={[
                {
                    id: { gln: "2125215-151256125-12521" },
                    lastEditedTime: "12521512521",
                    boxId: "12365126126",
                },
            ]}
            properties={[
                { ...indexed, name: "id.gln", isSortable: true },
                { ...indexed, name: "boxId", isSortable: true },
                { ...nonIndexed, name: "lastEditedTime" },
            ]}
            onDetailsClick={() => "scopeId/id"}
            onChangeSortClick={emptyMethod}
            onDeleteClick={deleteObject}
            objectType="Type"
            customRenderer={new NullCustomRenderer()}
            currentSorts={[{ path: "BoxId", sortOrder: ObjectFilterSortOrder.Descending }]}
            allowDelete={false}
        />
    ));
