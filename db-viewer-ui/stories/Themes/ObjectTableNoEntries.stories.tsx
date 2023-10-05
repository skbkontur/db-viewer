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

import { NullCustomRenderer } from "../../src";
import { ObjectTableContainer } from "../../src/Containers/ObjectTableContainer";
import { DbViewerApiFake } from "../Api/DbViewerApiFake";

import { reactUiDark } from "./reactUiDark";

export default {
    title: "Themes/ObjectTableZeroEntries",
};

const TableContainer = ({ theme }: { theme: Theme }) => (
    <ThemeContext.Provider value={theme}>
        <MemoryRouter initialEntries={["/AdminTools/Object/NotFound"]}>
            <Routes>
                <Route
                    path="/AdminTools/Object/:objectId"
                    element={
                        <ObjectTableContainer
                            isSuperUser
                            dbViewerApi={new DbViewerApiFake()}
                            customRenderer={new NullCustomRenderer()}
                            useErrorHandlingContainer
                        />
                    }
                />
            </Routes>
        </MemoryRouter>
    </ThemeContext.Provider>
);

export const Default = (): React.ReactElement => <TableContainer theme={DEFAULT_THEME} />;
export const Flat = (): React.ReactElement => <TableContainer theme={FLAT_THEME_8PX_OLD} />;
export const Old = (): React.ReactElement => <TableContainer theme={DEFAULT_THEME_8PX_OLD} />;
export const Dark = (): React.ReactElement => <TableContainer theme={ThemeFactory.create(reactUiDark)} />;
