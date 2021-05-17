import { css } from "@skbkontur/react-ui/lib/theming/Emotion";

import { baseSize } from "../Layouts/CommonLayout.styles";

export const jsStyles = {
    dateRangeItem(): string {
        return css`
            margin-right: ${baseSize * 2}px;
            line-height: 32px;

            &:last-child {
                margin-right: 0;
            }
        `;
    },
};
