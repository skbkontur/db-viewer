import Spinner from "@skbkontur/react-ui/Spinner";
import * as React from "react";

import cn from "./ButtonLink.less";

export interface ButtonLinkProps {
    "data-tid"?: Nullable<string>;
    use?: Nullable<"danger" | "success" | "danger-grayed">;
    children?: any;
    icon?: JSX.Element;
    rightIcon?: JSX.Element;
    onClick?: (e: React.MouseEvent<any>) => any;
    onMouseDown?: (e: React.MouseEvent<any>) => any;
    bold?: boolean;
    disabled?: boolean;
    className?: Nullable<string>;
    loading?: boolean;
    style?: React.CSSProperties;
}

export class ButtonLink extends React.Component<ButtonLinkProps> {
    public button: HTMLButtonElement | null = null;
    public focus(): void {
        setTimeout(() => {
            if (this.button != null) {
                this.button.focus();
            }
        }, 0);
    }

    public render(): JSX.Element {
        const {
            bold,
            loading,
            children,
            icon,
            onClick,
            use,
            rightIcon,
            disabled,
            className,
            onMouseDown,
            style,
        } = this.props;
        return (
            <button
                data-tid={this.props["data-tid"]}
                style={style}
                disabled={disabled}
                onClick={onClick}
                onMouseDown={onMouseDown}
                ref={el => (this.button = el)}
                className={cn("button", use, { bold: bold }, className)}>
                {icon != undefined && !loading && React.cloneElement(icon, { key: "icon" })}
                {loading && (
                    <span className={cn("spinner")}>
                        <Spinner type="mini" caption="" />
                    </span>
                )}
                {icon && children && "\u00A0"}
                {children && (
                    <span key="text" className={cn("content")}>
                        {children}
                    </span>
                )}
                {rightIcon && children && "\u00A0"}
                {rightIcon != undefined && React.cloneElement(rightIcon, { key: "rightIcon" })}
            </button>
        );
    }
}
