import { memoizeGetStyles } from "@skbkontur/react-ui/lib/theming/Emotion";

export const getStyles = memoizeGetStyles(({ css }) => ({
    root(): string {
        return css`
            display: inline-block;
            line-height: 20px;
            margin-top: -1px;
        `;
    },
}));
