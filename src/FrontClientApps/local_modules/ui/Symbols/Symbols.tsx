import * as React from "react";

import cn from "./Symbols.less";

export function muted(text: string | JSX.Element): JSX.Element {
    return <span className={cn("muted")}>{text}</span>;
}

export function noWrap(text: string | JSX.Element): JSX.Element {
    return <span className={cn("no-wrap")}>{text}</span>;
}

export class Symbols {
    public static EmDash = "\u2014";
    public static LongRightArrow = "\u27f6";
    public static NoBreakSpace = "\u00A0";
    public static Muted = {
        EmDash: muted("\u2014"),
    };
    public static Ruble = "\u20BD";

    public static MutedText(text: string | JSX.Element): JSX.Element {
        return muted(text);
    }

    public static NotWrappedText(text: string | JSX.Element): JSX.Element {
        return noWrap(text);
    }
}
