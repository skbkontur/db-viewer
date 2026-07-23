import { memoizeGetStyles } from "@skbkontur/react-ui/lib/theming/Emotion";
import { Theme } from "@skbkontur/react-ui/lib/theming/Theme";

export const getStyles = memoizeGetStyles(({ css }) => ({
    routerLink(t: Theme) {
        return css`
            color: ${t.linkColor};
            text-decoration: none;

            &:hover {
                text-decoration: underline;
            }
        `;
    },
}));
