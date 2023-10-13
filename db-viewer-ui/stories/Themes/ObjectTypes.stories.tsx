import {
    DEFAULT_THEME,
    DEFAULT_THEME_8PX_OLD,
    FLAT_THEME_8PX_OLD,
    ThemeContext,
    ThemeFactory,
} from "@skbkontur/react-ui";
import { Theme } from "@skbkontur/react-ui/lib/theming/Theme";
import React from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { withRouter } from "storybook-addon-react-router-v6";

import { ObjectTypesContainer } from "../../src/Containers/ObjectTypesContainer";
import { DbViewerApiFake } from "../Api/DbViewerApiFake";

import { reactUiDark } from "./reactUiDark";

export default {
    title: "Themes/ObjectTypes",
    decorators: [withRouter],
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
export const Flat = (): React.ReactElement => <TypesContainer theme={FLAT_THEME_8PX_OLD} />;
export const Old = (): React.ReactElement => <TypesContainer theme={DEFAULT_THEME_8PX_OLD} />;
export const Dark = (): React.ReactElement => <TypesContainer theme={ThemeFactory.create(reactUiDark)} />;
