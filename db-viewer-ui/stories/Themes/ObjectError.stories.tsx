import { LIGHT_THEME, DARK_THEME, ThemeContext, ThemeFactory } from "@skbkontur/react-ui";
import { Theme } from "@skbkontur/react-ui/lib/theming/Theme";
import React, { useContext } from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { NullCustomRenderer } from "../../src";
import { ObjectDetailsContainer } from "../../src/Containers/ObjectDetailsContainer";
import { DbViewerApiFake } from "../Api/DbViewerApiFake";

export default {
    title: "Themes/ObjectError",
};

const ErrorContainer = ({ theme }: { theme: Theme }) => {
    const currentTheme = useContext(ThemeContext);
    return (
        <ThemeContext.Provider value={ThemeFactory.create(currentTheme, theme)}>
            <MemoryRouter initialEntries={["/Error?Id=Id"]}>
                <Routes>
                    <Route
                        path="/:objectId"
                        element={
                            <ObjectDetailsContainer
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

export const Light = (): React.ReactElement => <ErrorContainer theme={LIGHT_THEME} />;
export const Dark = (): React.ReactElement => <ErrorContainer theme={DARK_THEME} />;
