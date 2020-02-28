import * as React from "react";

import cn from "./layout.less";

type VerticalAlign = "top" | "bottom" | "center" | "baseline" | "stretch";

interface RowStackProps {
    tag?: string | React.ComponentType<any>;
    children?: any;
    id?: string;
    block?: boolean;
    inline?: boolean;
    baseline?: boolean;
    verticalAlign?: VerticalAlign;
    className?: string;
    style?: { [key: string]: any };
    gap?: number;
    htlmFor?: null | string;
}

export class RowStack extends React.Component<RowStackProps> {
    public static verticalAlignMap = {
        top: "flex-start",
        bottom: "flex-end",
        center: "center",
        baseline: "baseline",
        stretch: "stretch",
    };

    public getFlexBoxAlignItems(horizontalAlign: VerticalAlign | typeof undefined, baseline: boolean): string {
        let resultHorizontalAlign = horizontalAlign || "top";
        if (baseline) {
            if (horizontalAlign !== undefined) {
                throw new Error("Should be specified horizontalAlign or one of it's shorthand");
            }
            resultHorizontalAlign = "baseline";
        }
        return RowStack.verticalAlignMap[resultHorizontalAlign];
    }

    public render(): JSX.Element {
        const {
            tag,
            children,
            block,
            inline,
            baseline,
            verticalAlign,
            className,
            style = {},
            gap = 0,
            id,
            ...rest
        } = this.props;
        const TagComponent = tag || "div";

        if (block === true && inline === true) {
            throw new Error("Only one of block or inline property should be specified");
        }
        return (
            <TagComponent
                {...rest}
                id={id}
                className={cn("row-stack", "gap-" + gap.toString(), { ["block"]: block }, className)}
                style={{
                    ...style,
                    alignItems: this.getFlexBoxAlignItems(verticalAlign, baseline || false),
                }}>
                {children}
            </TagComponent>
        );
    }
}

type HorizontalAlign = "left" | "right" | "center" | "stretch";

interface ColumnStackProps {
    tag?: string | React.ComponentType<any>;
    children?: any;
    block?: boolean;
    inline?: boolean;
    stretch?: boolean;
    horizontalAlign?: HorizontalAlign;
    className?: string;
    style?: { [key: string]: any };
    gap?: number;
}

export class ColumnStack extends React.Component<ColumnStackProps> {
    public static alignMap = {
        left: "flex-start",
        right: "flex-end",
        center: "center",
        stretch: "stretch",
    };

    public getFlexBoxAlignItems(horizontalAlign: HorizontalAlign | typeof undefined, stretch: boolean): string {
        let resultHorizontalAlign = horizontalAlign || "left";
        if (stretch) {
            if (horizontalAlign !== undefined) {
                throw new Error("Should be specified horizontalAlign or one of it's shorthand");
            }
            resultHorizontalAlign = "stretch";
        }
        return ColumnStack.alignMap[resultHorizontalAlign];
    }

    public render(): JSX.Element {
        const {
            tag,
            children,
            block,
            inline,
            stretch,
            horizontalAlign,
            className = "",
            style = {},
            gap = 0,
            ...rest
        } = this.props;

        if (block === true && inline === true) {
            throw new Error("Only one of block or inline property should be specified");
        }

        const TagComponent = tag || "div";
        return (
            <TagComponent
                {...rest}
                className={cn("column-stack", "gap-" + gap.toString(), { ["block"]: block }, className)}
                style={{
                    ...style,
                    alignItems: this.getFlexBoxAlignItems(horizontalAlign, stretch || false),
                }}>
                {children}
            </TagComponent>
        );
    }
}

interface FitProps {
    tag?: string | React.ComponentType<any>;
    className?: string;
    children?: React.ReactNode;
    nextGap?: Nullable<number>;
    style?: any;
    title?: null | string;
    htlmFor?: null | string;
    onClick?: (e: React.MouseEvent<any>) => mixed;
}

export function Fit({ tag, nextGap, className, children, ...rest }: FitProps): JSX.Element {
    const TagComponent = tag || "div";
    const gapClassName = nextGap != null ? "next-gap-" + nextGap.toString() : null;
    return (
        <TagComponent className={cn(className, "fit", gapClassName)} {...rest}>
            {children}
        </TagComponent>
    );
}

interface FillProps {
    tag?: string | React.ComponentType<any>;
    className?: string;
    children?: any;
}

export function Fill({ tag, children, className, ...rest }: FillProps): JSX.Element {
    const TagComponent = tag || "div";
    return (
        <TagComponent className={cn("fill", className)} {...rest}>
            {children}
        </TagComponent>
    );
}

interface FixedProps {
    "data-tid"?: Nullable<string>;
    tag?: string | React.ComponentType<any>;
    className?: string;
    children?: any;
    style?: {};
    width: number;
    allowWrap?: boolean;
    onClick?: () => void;
}

export function Fixed({ tag, children, width, className, style, allowWrap, ...rest }: FixedProps): JSX.Element {
    const TagComponent = tag || "div";
    return (
        <TagComponent
            className={cn("fixed", { "no-overflow": !allowWrap }, className)}
            style={{ ...style, width: width }}
            {...rest}>
            {children}
        </TagComponent>
    );
}
