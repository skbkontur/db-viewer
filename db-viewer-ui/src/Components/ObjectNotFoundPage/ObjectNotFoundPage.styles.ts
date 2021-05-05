import { css } from "@skbkontur/react-ui/lib/theming/Emotion";
import { Theme } from "@skbkontur/react-ui/lib/theming/Theme";

export const jsStyles = {
    content() {
        return css`
            margin: 100px auto 10px auto;
            max-width: 930px;
        `;
    },

    headerTitle() {
        return css`
            margin: 25px 0;
            font-weight: 300;
            font-size: 50px;
            line-height: 52px;
        `;
    },

    headerCode(t: Theme) {
        return css`
            vertical-align: super;
            color: ${t.textColorDisabled};
            font-size: 18px;
            line-height: 27px;
        `;
    },

    message() {
        return css`
            font-size: 18px;
            line-height: 25px;
        `;
    },
};
