import "../index.css";
import type { Preview } from "@storybook/react";
import { LIGHT_THEME, ThemeContext, ThemeFactory } from "@skbkontur/react-ui";
import React from "react";

const ThemeDecorator = (story: () => React.ReactNode): React.ReactElement => (
    <ThemeContext.Provider value={ThemeFactory.create({ linkTextDecorationColor: "transparent" }, LIGHT_THEME)}>
        {story()}
    </ThemeContext.Provider>
);

const preview: Preview = {
    parameters: {
        options: {
            storySort: { method: "alphabetical" },
        },
    },
    decorators: [ThemeDecorator],
};
export default preview;
