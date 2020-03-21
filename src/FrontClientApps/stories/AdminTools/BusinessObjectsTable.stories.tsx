import { storiesOf } from "@storybook/react";
import React from "react";
import StoryRouter from "storybook-react-router";

import { BusinessObjectFilterSortOrder } from "Domain/Api/DataTypes/BusinessObjectFilterSortOrder";

import { BusinessObjectsTable } from "../../src/Components/BusinessObjectsTable/BusinessObjectsTable";
import { PropertyMetaInformation } from "Domain/Api/DataTypes/PropertyMetaInformation";
import { BusinessObjectFieldFilterOperator } from "Domain/Api/DataTypes/BusinessObjectFieldFilterOperator";

async function deleteObject(_index: number): Promise<void> {
    // Ничего не делаем
}

export function emptyMethod() {
    // fake method
}

const nonIndexed: PropertyMetaInformation = {
    name: "name",
    type: null,
    isSortable: false,
    isSearchable: false,
    isRequired: false,
    isIdentity: false,
    availableFilters: [],
};

const indexed: PropertyMetaInformation = {
    name: "name",
    type: null,
    isSortable: false,
    isSearchable: false,
    isRequired: false,
    isIdentity: false,
    availableFilters: [BusinessObjectFieldFilterOperator.Equals, BusinessObjectFieldFilterOperator.DoesNotEqual],
};

storiesOf("BusinessObjectsTable", module)
    .addDecorator(StoryRouter())
    .add("Default", () => (
        <BusinessObjectsTable
            items={[{ id: "2125215-151256125-12521", lastModificationDateTime: "12521512521", scopeId: "12365126126" }]}
            properties={[
                { ...nonIndexed, name: "id.gln", type: "String" },
                { ...nonIndexed, name: "boxId", type: "String" },
                { ...indexed, name: "lastEditedTime", type: "String" },
            ]}
            onDetailsClick={() => "scopeId/id"}
            onChangeSortClick={emptyMethod}
            onDeleteClick={deleteObject}
            currentSort={{ path: "BoxId", sortOrder: BusinessObjectFilterSortOrder.Descending }}
            allowDelete
        />
    ))
    .add("Без удаления", () => (
        <BusinessObjectsTable
            items={[{ id: "2125215-151256125-12521", lastModificationDateTime: "12521512521", scopeId: "12365126126" }]}
            properties={[
                { ...indexed, name: "id.gln", type: "String" },
                { ...indexed, name: "boxId", type: "String" },
                { ...nonIndexed, name: "lastEditedTime", type: "String" },
            ]}
            onDetailsClick={() => "scopeId/id"}
            onChangeSortClick={emptyMethod}
            onDeleteClick={deleteObject}
            currentSort={{ path: "BoxId", sortOrder: BusinessObjectFilterSortOrder.Descending }}
            allowDelete={false}
        />
    ));
