import { DEFAULT_THEME, DEFAULT_THEME_8PX, FLAT_THEME, ThemeContext, ThemeFactory } from "@skbkontur/react-ui";
import { Theme } from "@skbkontur/react-ui/lib/theming/Theme";
import React from "react";
import StoryRouter from "storybook-react-router";

import { NullCustomRenderer } from "../../src";
import { ObjectTableContainer } from "../../src/Containers/ObjectTableContainer";
import { DbViewerApiFake } from "../Api/DbViewerApiFake";

import { infraUiDark } from "./infraUiDark";
import { reactUiDark } from "./reactUiDark";

export default {
    title: "Themes/ObjectTableZeroEntries",
    decorators: [StoryRouter()],
};

const TableContainer = ({ theme }: { theme: Theme }) => (
    <ThemeContext.Provider value={theme}>
        <ObjectTableContainer
            isSuperUser
            dbViewerApi={new DbViewerApiFake()}
            customRenderer={new NullCustomRenderer()}
            useErrorHandlingContainer
            urlQuery=""
            path="AdminTools/Object"
            objectId="NotFound"
        />
    </ThemeContext.Provider>
);

export const Default = (): JSX.Element => <TableContainer theme={DEFAULT_THEME} />;
export const Flat = (): JSX.Element => <TableContainer theme={FLAT_THEME} />;
export const EightPx = (): JSX.Element => <TableContainer theme={DEFAULT_THEME_8PX} />;
export const Dark = (): JSX.Element => <TableContainer theme={ThemeFactory.create(reactUiDark)} />;
export const InfraDark = (): JSX.Element => <TableContainer theme={ThemeFactory.create(infraUiDark)} />;
