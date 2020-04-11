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
    properties: [],
    isArray: false,
    isNullable: false,
    genericTypeArguments: [],
};

const nonIndexed: PropertyMetaInformation = {
    name: "name",
    type: string,
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
    isSortable: false,
    isSearchable: false,
    isRequired: false,
    isIdentity: false,
    availableFilters: [ObjectFieldFilterOperator.Equals, ObjectFieldFilterOperator.DoesNotEqual],
    availableValues: [],
};

storiesOf("ObjectTable", module)
    .addDecorator(StoryRouter())
    .add("Default", () => (
        <ObjectTable
            items={[{ id: "2125215-151256125-12521", lastModificationDateTime: "12521512521", scopeId: "12365126126" }]}
            properties={[
                { ...nonIndexed, name: "id.gln" },
                { ...nonIndexed, name: "boxId" },
                { ...indexed, name: "lastEditedTime" },
            ]}
            onDetailsClick={() => "scopeId/id"}
            onChangeSortClick={emptyMethod}
            objectType="Type"
            customRenderer={new NullCustomRenderer()}
            onDeleteClick={deleteObject}
            currentSort={{ path: "BoxId", sortOrder: ObjectFilterSortOrder.Descending }}
            allowDelete
        />
    ))
    .add("Без удаления", () => (
        <ObjectTable
            items={[{ id: "2125215-151256125-12521", lastModificationDateTime: "12521512521", scopeId: "12365126126" }]}
            properties={[
                { ...indexed, name: "id.gln" },
                { ...indexed, name: "boxId" },
                { ...nonIndexed, name: "lastEditedTime" },
            ]}
            onDetailsClick={() => "scopeId/id"}
            onChangeSortClick={emptyMethod}
            onDeleteClick={deleteObject}
            objectType="Type"
            customRenderer={new NullCustomRenderer()}
            currentSort={{ path: "BoxId", sortOrder: ObjectFilterSortOrder.Descending }}
            allowDelete={false}
        />
    ));
