import { css } from "@skbkontur/react-ui/lib/theming/Emotion";
import { Theme } from "@skbkontur/react-ui/lib/theming/Theme";

export const jsStyles = {
    modalText(t: Theme): string {
        return css`
            color: ${t.textColorDefault};
        `;
    },
};
