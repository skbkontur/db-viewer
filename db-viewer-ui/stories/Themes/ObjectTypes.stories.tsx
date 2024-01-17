import {
    DEFAULT_THEME,
    DARK_THEME,
    THEME_2022,
    THEME_2022_DARK,
    ThemeContext,
} from "@skbkontur/react-ui";
import { Theme } from "@skbkontur/react-ui/lib/theming/Theme";
import React from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { ObjectTypesContainer } from "../../src/Containers/ObjectTypesContainer";
import { DbViewerApiFake } from "../Api/DbViewerApiFake";

export default {
    title: "Themes/ObjectTypes",
};

const TypesContainer = ({ theme }: { theme: Theme }) => (
    <ThemeContext.Provider value={theme}>
        <MemoryRouter initialEntries={["/AdminTools"]}>
            <Routes>
                <Route
                    path="/AdminTools"
                    element={
                        <ObjectTypesContainer
                            useErrorHandlingContainer
                            identifierKeywords={["Cql", "StorageElement"]}
                            dbViewerApi={new DbViewerApiFake()}
                        />
                    }
                />
            </Routes>
        </MemoryRouter>
    </ThemeContext.Provider>
);

export const Default = (): React.ReactElement => <TypesContainer theme={DEFAULT_THEME} />;
export const Dark = (): React.ReactElement => <TypesContainer theme={DARK_THEME} />;
export const Theme2022 = (): React.ReactElement => <TypesContainer theme={THEME_2022} />;
export const Theme2022Dark = (): React.ReactElement => <TypesContainer theme={THEME_2022_DARK} />;
