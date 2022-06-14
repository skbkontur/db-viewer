import {
    DEFAULT_THEME,
    DEFAULT_THEME_8PX_OLD,
    FLAT_THEME_8PX_OLD,
    ThemeContext,
    ThemeFactory,
} from "@skbkontur/react-ui";
import { Theme } from "@skbkontur/react-ui/lib/theming/Theme";
import React from "react";
import StoryRouter from "storybook-react-router";

import { NullCustomRenderer } from "../../src";
import { ObjectTableContainer } from "../../src/Containers/ObjectTableContainer";
import { DbViewerApiFake } from "../Api/DbViewerApiFake";

import { reactUiDark } from "./reactUiDark";

export default {
    title: "Themes/ObjectTable",
    decorators: [StoryRouter()],
};

const TableContainer = ({ theme }: { theme: Theme }) => (
    <ThemeContext.Provider value={theme}>
        <ObjectTableContainer
            isSuperUser
            dbViewerApi={new DbViewerApiFake()}
            customRenderer={new NullCustomRenderer()}
            useErrorHandlingContainer
            urlQuery={""}
            path="AdminTools/Object"
            objectId="Object"
        />
    </ThemeContext.Provider>
);

export const Default = (): JSX.Element => <TableContainer theme={DEFAULT_THEME} />;
export const Flat = (): JSX.Element => <TableContainer theme={FLAT_THEME_8PX_OLD} />;
export const Old = (): JSX.Element => <TableContainer theme={DEFAULT_THEME_8PX_OLD} />;
export const Dark = (): JSX.Element => <TableContainer theme={ThemeFactory.create(reactUiDark)} />;
