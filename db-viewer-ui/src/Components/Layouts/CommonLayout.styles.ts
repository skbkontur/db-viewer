import { css } from "@skbkontur/react-ui/lib/theming/Emotion";
import { Theme } from "@skbkontur/react-ui/lib/theming/Theme";

export const baseSize = 5;

const globalHorizontalPadding = 5 * baseSize;
const globalVerticalPadding = 3 * baseSize;

export const jsStyles = {
    commonLayout(t: Theme) {
        return css`
            color: ${t.textColorDefault};
            background-color: ${t.bgDefault};
            position: relative;
            flex: 1 1 auto;
            display: flex;
            flex-direction: column;
            height: 100%;
            padding: ${globalVerticalPadding}px ${globalHorizontalPadding}px 0 ${globalHorizontalPadding}px;
        `;
    },

    topRightTools() {
        return css`
            position: absolute;
            top: ${baseSize}px;
            right: ${baseSize}px;
            z-index: 1;
        `;
    },

    greyLineHeader(t: Theme) {
        return css`
            background-color: ${t.bgDisabled};
        `;
    },
};
