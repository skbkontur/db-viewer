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
import { ObjectDetailsContainer } from "../../src/Containers/ObjectDetailsContainer";
import { DbViewerApiFake } from "../Api/DbViewerApiFake";

import { reactUiDark } from "./reactUiDark";

export default {
    title: "Themes/ObjectError",
};

const ErrorContainer = ({ theme }: { theme: Theme }) => (
    <ThemeContext.Provider value={theme}>
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

export const Default = (): React.ReactElement => <ErrorContainer theme={DEFAULT_THEME} />;
export const Flat = (): React.ReactElement => <ErrorContainer theme={FLAT_THEME_8PX_OLD} />;
export const Old = (): React.ReactElement => <ErrorContainer theme={DEFAULT_THEME_8PX_OLD} />;
export const Dark = (): React.ReactElement => <ErrorContainer theme={ThemeFactory.create(reactUiDark)} />;
