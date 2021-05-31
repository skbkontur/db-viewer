import { css } from "@skbkontur/react-ui/lib/theming/Emotion";
import { Theme } from "@skbkontur/react-ui/lib/theming/Theme";

export const baseSize = 5;

const globalHorizontalPadding = 5 * baseSize;
const globalVerticalPadding = 3 * baseSize;

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
            padding: ${globalVerticalPadding}px ${globalHorizontalPadding}px 0 ${globalHorizontalPadding}px;
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

    greyContent(): string {
        return css`
            margin-top: ${2 * baseSize}px;
        `;
    },

    headerTitle(): string {
        return css`
            margin: 0;
            font-weight: 300;
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

    backLinkContainer(): string {
        return css`
            margin-bottom: ${3 * baseSize}px;
            margin-left: -4px;
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
