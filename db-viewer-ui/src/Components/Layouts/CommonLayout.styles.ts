import { css } from "@skbkontur/react-ui/lib/theming/Emotion";
import { Theme } from "@skbkontur/react-ui/lib/theming/Theme";

export const baseSize = 5;
const newBaseSize = 4;

const globalHorizontalPadding = newBaseSize * 7;
const globalVerticalPadding = newBaseSize * 10;

export const jsStyles = {
    commonLayout(t: Theme): string {
        return css`
            color: ${t.textColorDefault};
            background-color: ${t.bgDefault};
            position: relative;
            flex: 1 1 auto;
            display: flex;
            flex-direction: column;
            height: 100%;
            padding: ${globalVerticalPadding}px ${globalHorizontalPadding}px 0;
        `;
    },

    withArrow(): string {
        return css`
            padding: ${globalVerticalPadding}px ${newBaseSize * 12}px 0;
        `;
    },

    topRightTools(): string {
        return css`
            position: absolute;
            top: ${baseSize}px;
            right: ${baseSize}px;
            z-index: 1;
        `;
    },

    greyLineHeader(t: Theme): string {
        return css`
            background-color: ${t.bgDisabled};
            padding: ${2 * baseSize}px ${globalHorizontalPadding}px;
            margin-left: ${-globalHorizontalPadding}px;
            margin-right: ${-globalHorizontalPadding}px;
            margin-bottom: ${3 * baseSize}px;
            word-break: break-all;
        `;
    },

    headerContent(): string {
        return css`
            margin-top: ${3 * newBaseSize}px;
        `;
    },

    headerTitle(): string {
        return css`
            margin: 0;
            font-weight: 700;
            font-size: 29px;
            line-height: 40px;
        `;
    },

    content(): string {
        return css`
            display: flex;
            flex-direction: column;
            flex: 1 1 auto;
            padding-bottom: ${globalVerticalPadding}px;
        `;
    },

    header(): string {
        return css`
            margin-bottom: ${3 * baseSize}px;
        `;
    },

    borderBottom(t: Theme): string {
        return css`
            border-bottom: 2px solid ${t.grayXLight};
        `;
    },

    backLink(): string {
        return css`
            position: absolute;
            left: 2px;
            opacity: 0.7;
            height: ${newBaseSize * 7}px;
            width: ${newBaseSize * 7}px;
            padding: ${newBaseSize * 2}px 0 ${newBaseSize * 2}px ${newBaseSize * 2}px;
            display: flex;
            align-items: center;
            justify-content: center;

            &:hover {
                opacity: 1;
            }
        `;
    },

    backLinkIcon(): string {
        return css`
            display: block;
        `;
    },

    loader(): string {
        return css`
            display: flex !important;
            flex-direction: column;
            flex: 1 1 auto;
        `;
    },
};
