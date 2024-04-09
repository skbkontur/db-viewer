import { css } from "@skbkontur/react-ui/lib/theming/Emotion";
import { Theme } from "@skbkontur/react-ui/lib/theming/Theme";

export const jsStyles = {
    modalHeader(t: Theme): string {
        return css`
            font-weight: 700;
            color: ${t.textColorDefault};
        `;
    },

    modalBody(t: Theme): string {
        return css`
            color: ${t.textColorDefault};
            font-size: 16px;
        `;
    },

    modalCaption(): string {
        return css`
            display: inline-block;
            margin-bottom: 16px;
        `;
    },
};
