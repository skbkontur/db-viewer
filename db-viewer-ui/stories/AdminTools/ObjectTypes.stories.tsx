import { storiesOf } from "@storybook/react";
import React from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { ObjectTypes } from "../../src/Components/ObjectTypes/ObjectTypes";
import { ObjectIdentifier } from "../../src/Domain/Api/DataTypes/ObjectIdentifier";
import { SchemaDescription } from "../../src/Domain/Api/DataTypes/SchemaDescription";

import objects from "./Responses/objects.json";

const schema: SchemaDescription = {
    allowReadAll: true,
    allowDelete: true,
    allowEdit: true,
    allowSort: true,
    schemaName: "ab",
    downloadLimit: 100,
    countLimit: 10,
    countLimitForSuperUser: 1000,
    downloadLimitForSuperUser: 10000,
};

storiesOf("ObjectTypes", module)
    .add("Default", () => (
        <TypesContainer
            objects={[
                {
                    identifier: "table 1",
                    schemaDescription: schema,
                },
                {
                    identifier: "Table 3",
                    schemaDescription: schema,
                },
                {
                    identifier: "table 2",
                    schemaDescription: schema,
                },
            ]}
        />
    ))
    .add("EDI Objects", () => <TypesContainer objects={objects} />);

function TypesContainer({ objects }: { objects: ObjectIdentifier[] }): JSX.Element {
    return (
        <MemoryRouter initialEntries={["/AdminTools"]}>
            <Routes>
                <Route
                    path="/AdminTools"
                    element={<ObjectTypes identifierKeywords={[]} filter="" objects={objects} />}
                />
            </Routes>
        </MemoryRouter>
    );
}
