import { storiesOf } from "@storybook/react";
import React from "react";
import StoryRouter from "storybook-react-router";

import { BusinessObjectFilterSortOrder } from "Domain/Api/DataTypes/BusinessObjectFilterSortOrder";

import { BusinessObjectsTable } from "../../src/Components/BusinessObjectsTable/BusinessObjectsTable";

async function deleteObject(_index: number): Promise<void> {
    // Ничего не делаем
}

export function emptyMethod() {
    // fake method
}

storiesOf("BusinessObjectsTable", module)
    .addDecorator(StoryRouter())
    .add("Default", () => (
        <BusinessObjectsTable
            items={[{ id: "2125215-151256125-12521", lastModificationDateTime: "12521512521", scopeId: "12365126126" }]}
            properties={[
                { name: "id.gln", type: "String", indexed: false },
                { name: "boxId", type: "String", indexed: false },
                { name: "lastEditedTime", type: "String", indexed: true },
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
                { name: "id.gln", type: "String", indexed: true },
                { name: "boxId", type: "String", indexed: true },
                { name: "lastEditedTime", type: "String", indexed: false },
            ]}
            onDetailsClick={() => "scopeId/id"}
            onChangeSortClick={emptyMethod}
            onDeleteClick={deleteObject}
            currentSort={{ path: "BoxId", sortOrder: BusinessObjectFilterSortOrder.Descending }}
            allowDelete={false}
        />
    ));
