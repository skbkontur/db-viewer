import { css } from "@skbkontur/react-ui/lib/theming/Emotion";

export const jsStyles = {
    container(): string {
        return css`
            width: 100%;
            position: relative;
            overflow: hidden;

            &::after {
                box-shadow: 5px 0 4px -5px #00000059;
                content: "";
                position: absolute;
                top: 0;
                left: -20px;
                bottom: 0;
                width: 20px;
                opacity: 0;
                transition: opacity 0.2s ease-in-out;
            }

            &::before {
                box-shadow: -5px 0 4px -5px #00000059;
                content: "";
                position: absolute;
                top: 0;
                right: -20px;
                bottom: 0;
                width: 20px;
                z-index: 1;
                transition: opacity 0.2s ease-in-out;
                opacity: 0;
            }
        `;
    },

    leftShadow(): string {
        return css`
            &::after {
                opacity: 1;
            }
        `;
    },

    rightShadow(): string {
        return css`
            &::before {
                opacity: 1;
            }
        `;
    },

    root(): string {
        return css`
            width: 100%;
            overflow-x: auto;
        `;
    },
};
