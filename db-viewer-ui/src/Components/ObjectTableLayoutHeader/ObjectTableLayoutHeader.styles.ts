import { memoizeGetStyles } from "@skbkontur/react-ui/lib/theming/Emotion";

export const getStyles = memoizeGetStyles(({ css }) => ({
    filter(): string {
        return css`
            font-weight: bold;
        `;
    },

    countSelector(): string {
        return css`
            padding: 10px;
        `;
    },
}));
