import { DEFAULT_THEME, DEFAULT_THEME_8PX, FLAT_THEME, ThemeContext, ThemeFactory } from "@skbkontur/react-ui";
import { Theme } from "@skbkontur/react-ui/lib/theming/Theme";
import React from "react";
import StoryRouter from "storybook-react-router";

import { DbViewerApiFake } from "../../DbViewerApiFake";
import { NullCustomRenderer } from "../../src";
import { ObjectDetailsContainer } from "../../src/Containers/ObjectDetailsContainer";

import { infraUiDark } from "./infraUiDark";
import { reactUiDark } from "./reactUiDark";

export default {
    title: "Themes/ObjectDetails",
    decorators: [StoryRouter()],
};

const DetailsContainer = ({ theme }: { theme: Theme }) => (
    <ThemeContext.Provider value={theme}>
        <div style={{ backgroundColor: theme.bgDefault }}>
            <ObjectDetailsContainer
                isSuperUser
                dbViewerApi={new DbViewerApiFake()}
                customRenderer={new NullCustomRenderer()}
                useErrorHandlingContainer
                objectQuery="Id=Id"
                objectId="Object"
            />
        </div>
    </ThemeContext.Provider>
);

export const Default = () => <DetailsContainer theme={DEFAULT_THEME} />;
export const Flat = () => <DetailsContainer theme={FLAT_THEME} />;
export const EightPx = () => <DetailsContainer theme={DEFAULT_THEME_8PX} />;
export const Dark = () => <DetailsContainer theme={ThemeFactory.create(reactUiDark)} />;
export const InfraDark = () => <DetailsContainer theme={ThemeFactory.create(infraUiDark)} />;
