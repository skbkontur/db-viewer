import * as React from "react";

export function isTestingMode(): boolean {
    if (!document.body) {
        return false;
    }
    return document.body.classList.contains("testingMode") || document.cookie.search("testingMode=1") >= 0;
}

interface RetailUiStickyProps {
    side: "top" | "bottom";
    offset?: number;
    getStop?: () => Nullable<HTMLElement>;
    children?: any;
    zIndex?: number;
}

export class StickyForTestingMode extends React.Component<RetailUiStickyProps> {
    public static defaultProps = { offset: 0 };

    public _reflow() {
        // DoNothing
        // For type compatibility
    }

    public render(): JSX.Element {
        const { children } = this.props;
        return <div>{typeof children === "function" ? children() : children}</div>;
    }
}

export function concatTids(...args: Array<string | undefined>): string {
    return args.filter(x => x != undefined).join(" ");
}
