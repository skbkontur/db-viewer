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
import { ObjectDetailsContainer } from "../../src/Containers/ObjectDetailsContainer";
import { DbViewerApiFake } from "../Api/DbViewerApiFake";

export default {
    title: "Themes/ObjectNotFound",
};

const DetailsContainer = ({ theme }: { theme: Theme }) => (
    <ThemeContext.Provider value={theme}>
        <MemoryRouter initialEntries={["/NotFound?Id=Id"]}>
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

export const Default = (): React.ReactElement => <DetailsContainer theme={DEFAULT_THEME} />;
export const Dark = (): React.ReactElement => <DetailsContainer theme={DARK_THEME} />;
export const Theme2022 = (): React.ReactElement => <DetailsContainer theme={THEME_2022} />;
export const Theme2022Dark = (): React.ReactElement => <DetailsContainer theme={THEME_2022_DARK} />;
