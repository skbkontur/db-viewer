import * as React from "react";

import cn from "./layout.less";

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
