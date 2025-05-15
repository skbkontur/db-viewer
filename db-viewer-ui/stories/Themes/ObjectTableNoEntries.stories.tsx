import { LIGHT_THEME, DARK_THEME, ThemeContext, ThemeFactory } from "@skbkontur/react-ui";
import { Theme } from "@skbkontur/react-ui/lib/theming/Theme";
import React, { useContext } from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { NullCustomRenderer } from "../../src";
import { ObjectTableContainer } from "../../src/Containers/ObjectTableContainer";
import { DbViewerApiFake } from "../Api/DbViewerApiFake";

export default {
    title: "Themes/ObjectTableZeroEntries",
};

const TableContainer = ({ theme }: { theme: Theme }) => {
    const currentTheme = useContext(ThemeContext);
    return (
        <ThemeContext.Provider value={ThemeFactory.create(currentTheme, theme)}>
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
};

export const Light = (): React.ReactElement => <TableContainer theme={LIGHT_THEME} />;
export const Dark = (): React.ReactElement => <TableContainer theme={DARK_THEME} />;
