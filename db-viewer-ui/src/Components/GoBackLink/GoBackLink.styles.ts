import { css } from "@skbkontur/react-ui/lib/theming/Emotion";

import icon from "./assets/go-back-icon.svg";

export const jsStyles = {
    goBackLink(): string {
        return css`
            width: 35px;
            height: 35px;
            display: inline-block;
            background: url("${icon}");
            opacity: 0.7;
            &:hover {
                opacity: 1;
            }
        `;
    },
};
