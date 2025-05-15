import { LIGHT_THEME, DARK_THEME, ThemeContext, ThemeFactory } from "@skbkontur/react-ui";
import { Theme } from "@skbkontur/react-ui/lib/theming/Theme";
import React, { useContext } from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { ObjectTypesContainer } from "../../src/Containers/ObjectTypesContainer";
import { DbViewerApiFake } from "../Api/DbViewerApiFake";

export default {
    title: "Themes/ObjectTypes",
};

const TypesContainer = ({ theme }: { theme: Theme }) => {
    const currentTheme = useContext(ThemeContext);
    return (
        <ThemeContext.Provider value={ThemeFactory.create(currentTheme, theme)}>
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
};

export const Light = (): React.ReactElement => <TypesContainer theme={LIGHT_THEME} />;
export const Dark = (): React.ReactElement => <TypesContainer theme={DARK_THEME} />;
