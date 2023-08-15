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
            flex-grow: 1;
            line-height: 48px;
            word-break: break-all;
            white-space: pre-wrap;
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

    headerWrapper(): string {
        return css`
            margin-bottom: ${5 * newBaseSize}px;
            word-break: break-all;
        `;
    },

    header(): string {
        return css`
            display: flex;
            align-items: baseline;
            flex-wrap: wrap;
            gap: ${newBaseSize * 2}px;
            white-space: nowrap;
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
            left: 0;
            height: ${newBaseSize * 12}px;
            width: ${newBaseSize * 12}px;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
    },

    backLinkIcon(t: Theme): string {
        return css`
            display: block;
            color: #757575;

            &:hover {
                color: ${t.textColorDefault};
            }
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
