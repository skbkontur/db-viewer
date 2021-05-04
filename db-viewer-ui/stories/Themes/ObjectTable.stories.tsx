import { DEFAULT_THEME, DEFAULT_THEME_8PX, FLAT_THEME, ThemeContext, ThemeFactory } from "@skbkontur/react-ui";
import { Theme } from "@skbkontur/react-ui/lib/theming/Theme";
import React from "react";
import StoryRouter from "storybook-react-router";

import { DbViewerApiFake } from "../../DbViewerApiFake";
import { NullCustomRenderer } from "../../src";
import { ObjectTableContainer } from "../../src/Containers/ObjectTableContainer";

import { infraUiDark } from "./infraUiDark";
import { reactUiDark } from "./reactUiDark";

export default {
    title: "Themes/ObjectTable",
    decorators: [StoryRouter()],
};

const TableContainer = ({ theme }: { theme: Theme }) => (
    <ThemeContext.Provider value={theme}>
        <div style={{ backgroundColor: theme.bgDefault }}>
            <ObjectTableContainer
                isSuperUser
                dbViewerApi={new DbViewerApiFake()}
                customRenderer={new NullCustomRenderer()}
                useErrorHandlingContainer
                urlQuery={""}
                path="AdminTools/Object"
                objectId="Object"
            />
        </div>
    </ThemeContext.Provider>
);

export const Default = () => <TableContainer theme={DEFAULT_THEME} />;
export const Flat = () => <TableContainer theme={FLAT_THEME} />;
export const EightPx = () => <TableContainer theme={DEFAULT_THEME_8PX} />;
export const Dark = () => <TableContainer theme={ThemeFactory.create(reactUiDark)} />;
export const InfraDark = () => <TableContainer theme={ThemeFactory.create(infraUiDark)} />;
