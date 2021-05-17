import { css } from "@skbkontur/react-ui/lib/theming/Emotion";
import { Theme } from "@skbkontur/react-ui/lib/theming/Theme";

export const jsStyles = {
    caption(t: Theme): string {
        return css`
            color: ${t.textColorDefault};
            padding-top: 7px;
            box-sizing: border-box;
        `;
    },
};
