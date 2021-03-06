import { css } from "@skbkontur/react-ui/lib/theming/Emotion";
import { Theme } from "@skbkontur/react-ui/lib/theming/Theme";

export const jsStyles = {
    tableWrapper(): string {
        return css`
            white-space: nowrap;
        `;
    },

    cell(): string {
        return css`
            padding: 10px;
        `;
    },

    headerCell(): string {
        return css`
            font: inherit;
            text-align: left;
        `;
    },

    row(t: Theme): string {
        return css`
            border-bottom: 1px solid ${t.borderColorGrayLight};
        `;
    },

    tableHeaderRow(t: Theme): string {
        return css`
            border-bottom: 1px solid ${t.borderColorGrayDark};
        `;
    },

    container(): string {
        return css`
            position: relative;
            display: inline-block;
        `;
    },

    table(): string {
        return css`
            border-collapse: collapse;
            border-spacing: 0;
        `;
    },
};
