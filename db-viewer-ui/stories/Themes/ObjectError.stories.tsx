import { DEFAULT_THEME, DEFAULT_THEME_OLD, FLAT_THEME, ThemeContext, ThemeFactory } from "@skbkontur/react-ui";
import { Theme } from "@skbkontur/react-ui/lib/theming/Theme";
import React from "react";
import StoryRouter from "storybook-react-router";

import { NullCustomRenderer } from "../../src";
import { ObjectDetailsContainer } from "../../src/Containers/ObjectDetailsContainer";
import { DbViewerApiFake } from "../Api/DbViewerApiFake";

import { reactUiDark } from "./reactUiDark";

export default {
    title: "Themes/ObjectError",
    decorators: [StoryRouter()],
};

const ErrorContainer = ({ theme }: { theme: Theme }) => (
    <ThemeContext.Provider value={theme}>
        <ObjectDetailsContainer
            isSuperUser
            dbViewerApi={new DbViewerApiFake()}
            customRenderer={new NullCustomRenderer()}
            useErrorHandlingContainer
            objectQuery="Id=Id"
            objectId="Error"
        />
    </ThemeContext.Provider>
);

export const Default = (): JSX.Element => <ErrorContainer theme={DEFAULT_THEME} />;
export const Flat = (): JSX.Element => <ErrorContainer theme={FLAT_THEME} />;
export const Old = (): JSX.Element => <ErrorContainer theme={DEFAULT_THEME_OLD} />;
export const Dark = (): JSX.Element => <ErrorContainer theme={ThemeFactory.create(reactUiDark)} />;
