import { css } from "@skbkontur/react-ui/lib/theming/Emotion";
import { Theme } from "@skbkontur/react-ui/lib/theming/Theme";

export const jsStyles = {
    root() {
        return css`
            min-width: 800px;
            column-count: 3;
        `;
    },

    schema(t: Theme) {
        return css`
            font-size: 20px;
            padding-top: 20px;
            color: ${t.textColorDefault};
            border-bottom: 1px solid ${t.borderColorGrayDark};
            margin-bottom: 10px;
            padding-bottom: 10px;
        `;
    },

    firstLetter(t: Theme) {
        return css`
            margin-top: 20px;
            margin-bottom: 5px;
            padding-bottom: 5px;
            font-weight: 600;
            color: ${t.textColorDefault};
            border-bottom: 1px solid ${t.borderColorGrayLight};

            &:first-child {
                margin-top: 0;
            }
        `;
    },

    typeGroup() {
        return css`
            break-inside: avoid;
            page-break-inside: avoid;
        `;
    },

    indexed() {
        return css`
            vertical-align: super;
            font-size: 9px;
            line-height: 14px;
        `;
    },

    mutedKeyword(t: Theme) {
        return css`
            color: ${t.textColorDisabled};
        `;
    },
};
