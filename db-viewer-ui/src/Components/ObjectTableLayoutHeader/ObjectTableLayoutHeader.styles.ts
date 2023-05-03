import { css } from "@skbkontur/react-ui/lib/theming/Emotion";

export const jsStyles = {
    filter(): string {
        return css`
            font-weight: bold;
        `;
    },

    header(): string {
        return css`
            margin-top: 4px;
        `;
    },

    countSelector(): string {
        return css`
            padding: 10px;
        `;
    },
};
