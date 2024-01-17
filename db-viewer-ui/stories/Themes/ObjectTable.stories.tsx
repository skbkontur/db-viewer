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

import { NullCustomRenderer } from "../../src";
import { ObjectTableContainer } from "../../src/Containers/ObjectTableContainer";
import { DbViewerApiFake } from "../Api/DbViewerApiFake";

export default {
    title: "Themes/ObjectTable",
};

const TableContainer = ({ theme }: { theme: Theme }) => (
    <ThemeContext.Provider value={theme}>
        <MemoryRouter initialEntries={["/AdminTools/Object/Object"]}>
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
export const Dark = (): React.ReactElement => <TableContainer theme={DARK_THEME} />;
export const Theme2022 = (): React.ReactElement => <TableContainer theme={THEME_2022} />;
export const Theme2022Dark = (): React.ReactElement => <TableContainer theme={THEME_2022_DARK} />;
