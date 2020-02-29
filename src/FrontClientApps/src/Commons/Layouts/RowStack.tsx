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
