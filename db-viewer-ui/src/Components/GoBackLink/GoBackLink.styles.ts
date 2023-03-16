import { css } from "@skbkontur/react-ui/lib/theming/Emotion";

export const jsStyles = {
    goBackLink(): string {
        return css`
            width: 35px;
            height: 35px;
            display: inline-block;
            opacity: 0.7;
            &:hover {
                opacity: 1;
            }
        `;
    },
};
