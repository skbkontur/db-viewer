import { storiesOf } from "@storybook/react";
import * as React from "react";
import StoryRouter from "storybook-react-router";

import { ObjectTable } from "../../src/Components/ObjectTable/ObjectTable";
import { BusinessObjectFieldFilterOperator } from "../../src/Domain/Api/DataTypes/BusinessObjectFieldFilterOperator";
import { BusinessObjectFilterSortOrder } from "../../src/Domain/Api/DataTypes/BusinessObjectFilterSortOrder";
import { PropertyMetaInformation } from "../../src/Domain/Api/DataTypes/PropertyMetaInformation";
import { NullCustomRenderer } from "../../src/Domain/BusinessObjects/CustomRenderer";

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

storiesOf("ObjectTable", module)
    .addDecorator(StoryRouter())
    .add("Default", () => (
        <ObjectTable
            items={[{ id: "2125215-151256125-12521", lastModificationDateTime: "12521512521", scopeId: "12365126126" }]}
            properties={[
                { ...nonIndexed, name: "id.gln", type: "String" },
                { ...nonIndexed, name: "boxId", type: "String" },
                { ...indexed, name: "lastEditedTime", type: "String" },
            ]}
            onDetailsClick={() => "scopeId/id"}
            onChangeSortClick={emptyMethod}
            customRenderer={new NullCustomRenderer()}
            onDeleteClick={deleteObject}
            currentSort={{ path: "BoxId", sortOrder: BusinessObjectFilterSortOrder.Descending }}
            allowDelete
        />
    ))
    .add("Без удаления", () => (
        <ObjectTable
            items={[{ id: "2125215-151256125-12521", lastModificationDateTime: "12521512521", scopeId: "12365126126" }]}
            properties={[
                { ...indexed, name: "id.gln", type: "String" },
                { ...indexed, name: "boxId", type: "String" },
                { ...nonIndexed, name: "lastEditedTime", type: "String" },
            ]}
            onDetailsClick={() => "scopeId/id"}
            onChangeSortClick={emptyMethod}
            onDeleteClick={deleteObject}
            customRenderer={new NullCustomRenderer()}
            currentSort={{ path: "BoxId", sortOrder: BusinessObjectFilterSortOrder.Descending }}
            allowDelete={false}
        />
    ));
