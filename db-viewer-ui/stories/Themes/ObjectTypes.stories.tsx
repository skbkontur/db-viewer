import { DEFAULT_THEME, DEFAULT_THEME_8PX, FLAT_THEME, ThemeContext, ThemeFactory } from "@skbkontur/react-ui";
import { Theme } from "@skbkontur/react-ui/lib/theming/Theme";
import React from "react";
import StoryRouter from "storybook-react-router";

import { DbViewerApiFake } from "../../DbViewerApiFake";
import { ObjectTypesContainer } from "../../src/Containers/ObjectTypesContainer";

import { infraUiDark } from "./infraUiDark";
import { reactUiDark } from "./reactUiDark";

export default {
    title: "Themes/ObjectTypes",
    decorators: [StoryRouter()],
};

const TypesContainer = ({ theme }: { theme: Theme }) => (
    <ThemeContext.Provider value={theme}>
        <div style={{ backgroundColor: theme.bgDefault }}>
            <ObjectTypesContainer
                useErrorHandlingContainer
                identifierKeywords={["Cql", "StorageElement"]}
                dbViewerApi={new DbViewerApiFake()}
                path="/AdminTools"
            />
        </div>
    </ThemeContext.Provider>
);

export const Default = () => <TypesContainer theme={DEFAULT_THEME} />;
export const Flat = () => <TypesContainer theme={FLAT_THEME} />;
export const EightPx = () => <TypesContainer theme={DEFAULT_THEME_8PX} />;
export const Dark = () => <TypesContainer theme={ThemeFactory.create(reactUiDark)} />;
export const InfraDark = () => <TypesContainer theme={ThemeFactory.create(infraUiDark)} />;
