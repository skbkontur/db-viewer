import { css } from "@skbkontur/react-ui/lib/theming/Emotion";
import { Theme } from "@skbkontur/react-ui/lib/theming/Theme";

import { baseSize } from "../Layouts/CommonLayout.styles";

export const jsStyles = {
    root() {
        return css`
            min-width: 500px;
        `;
    },

    nothingToDisplay(t: Theme) {
        return css`
            color: ${t.textColorDisabled};
            font-style: italic;
        `;
    },

    fieldList() {
        return css`
            margin: ${baseSize * 2}px 0;
            min-height: 40px;
        `;
    },

    field() {
        return css`
            padding-bottom: ${baseSize}px;
            padding-right: ${baseSize * 2}px;
        `;
    },

    fieldContent() {
        return css`
            max-width: 350px;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
        `;
    },

    selectAll(t: Theme) {
        return css`
            width: 170px;
            display: inline-block;
            background-color: ${t.bgDisabled};
            color: ${t.textColorDisabled};
            padding: ${baseSize}px ${baseSize * 2}px;
            margin-left: ${baseSize * 2}px;
            text-align: center;

            &:hover {
                cursor: pointer;
                text-decoration: underline;
            }
        `;
    },
};
