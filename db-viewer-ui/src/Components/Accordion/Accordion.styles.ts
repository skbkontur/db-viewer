import { css } from "@skbkontur/react-ui/lib/theming/Emotion";
import { Theme } from "@skbkontur/react-ui/lib/theming/Theme";

import { baseSize } from "../Layouts/CommonLayout.styles";

export const jsStyles = {
    valueWrapper(): string {
        return css`
            padding-left: ${4 * baseSize}px;
        `;
    },

    titleBlockHasTitle(t: Theme): string {
        return css`
            &:hover a {
                color: ${t.linkColor};
            }
        `;
    },

    toggleAllLink(): string {
        return css`
            display: inline-block;
            margin-left: ${2 * baseSize}px;
        `;
    },

    stringWrapper(t: Theme): string {
        return css`
            padding: ${baseSize}px 0 ${baseSize}px ${4 * baseSize}px;

            & + .stringWrapper {
                border-top: 1px solid ${t.borderColorGrayLight};
            }
        `;
    },

    toggleButton(): string {
        return css`
            color: inherit;
            font-size: inherit;
            font-family: inherit;
            background: none;
            border: none;
            padding: ${baseSize}px 0;
            margin-left: ${-4 * baseSize}px;
            cursor: pointer;
            outline: none;
            text-transform: capitalize;
        `;
    },

    toggleButtonText(): string {
        return css`
            margin-left: ${baseSize}px;
        `;
    },

    title(): string {
        return css`
            text-transform: capitalize;
            min-width: 140px;
            display: inline-block;
            padding-right: ${2 * baseSize}px;
        `;
    },

    value(): string {
        return css`
            min-width: 1%;
            word-wrap: break-word;
        `;
    },

    mutedKeyword(t: Theme): string {
        return css`
            color: ${t.textColorDisabled};
        `;
    },
};
