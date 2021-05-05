import { css } from "@skbkontur/react-ui/lib/theming/Emotion";
import { Theme } from "@skbkontur/react-ui/lib/theming/Theme";

export const jsStyles = {
    routerLink(t: Theme) {
        return css`
            color: ${t.linkColor};
            text-decoration: none;

            &:hover {
                text-decoration: underline;
            }
        `;
    },
};
