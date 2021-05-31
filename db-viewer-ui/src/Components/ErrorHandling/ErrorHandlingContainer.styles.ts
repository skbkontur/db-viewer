import { css } from "@skbkontur/react-ui/lib/theming/Emotion";
import { Theme } from "@skbkontur/react-ui/lib/theming/Theme";

import { baseSize } from "../Layouts/CommonLayout.styles";

export const jsStyles = {
    tableWrapper(): string {
        return css`
            white-space: nowrap;
        `;
    },

    modalText(t: Theme): string {
        return css`
            color: ${t.textColorDefault};
        `;
    },

    header(): string {
        return css`
            margin: 0;
            font-size: 18px;
            line-height: 25px;
            font-weight: 500;
        `;
    },

    content(): string {
        return css`
            & > p {
                margin: 0;
            }
        `;
    },

    userMessage(): string {
        return css`
            & > p {
                margin-bottom: ${baseSize}px;
            }
        `;
    },

    errorMessageWrap(): string {
        return css`
            min-width: 100%;
            width: 0;
        `;
    },

    stackTraceContainer(): string {
        return css`
            margin-bottom: ${baseSize * 4}px;
        `;
    },

    stackTrace(t: Theme): string {
        return css`
            font-family: "Consolas", monospace;
            font-size: 12px;
            padding: ${baseSize}px ${baseSize * 2}px;
            margin: ${baseSize}px ${-baseSize * 2}px;
            background-color: ${t.bgDisabled};
            white-space: pre-wrap;
            word-wrap: break-word;
            max-height: 250px;
            overflow-y: auto;
        `;
    },

    stackTraces(): string {
        return css`
            margin: ${baseSize * 6}px 0;
            max-width: 800px;
        `;
    },
};
