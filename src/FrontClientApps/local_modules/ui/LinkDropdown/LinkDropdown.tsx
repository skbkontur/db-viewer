import ArrowTriangleDownIcon from "@skbkontur/react-icons/ArrowTriangleDown";
import * as React from "react";
import { RouterLink } from "ui";
import { listenFocusOutside, ListenFocusOutsideSubscription } from "ui/utils";

import cn from "./LinkDropdown.less";

interface LinkDropdownMenuItemProps {
    children?: React.ReactNode;
    className?: null | string;
    href?: null | string;
    to?: null | string;
    target?: null | string;
    disabled?: boolean;
    description?: string;
    onClick?: (e: React.MouseEvent<any>) => void;
}

function LinkDropdownMenuItem(props: LinkDropdownMenuItemProps): JSX.Element {
    const { children, className, href, to, target, description, ...restProps } = props;
    if (href || to) {
        return (
            <RouterLink
                className={cn("menu-item", className)}
                href={href}
                to={to}
                target={target || undefined}
                {...restProps}>
                {children}
                <div className={cn("menu-item-description")}>{description}</div>
            </RouterLink>
        );
    }
    return (
        <div className={cn("menu-item", className, { disabled: props.disabled })} {...restProps}>
            {children}
            <div className={cn("menu-item-description")}>{description}</div>
        </div>
    );
}

interface LinkDropdownProps {
    iconName?: JSX.Element;
    children?: any;
    renderTitle: string | (() => any);
    disabled?: boolean;
}

interface LinkDropdownState {
    opened: boolean;
}

export class LinkDropdown extends React.Component<LinkDropdownProps, LinkDropdownState> {
    public state: LinkDropdownState = {
        opened: false,
    };
    public link: HTMLDivElement | null = null;

    public _focusSubscribtion: null | ListenFocusOutsideSubscription = null;

    public static MenuItem = LinkDropdownMenuItem;

    public toggleMenu() {
        if (!this.props.disabled) {
            this.setState({ opened: !this.state.opened });
        }
    }

    public closeMenu() {
        this.setState({ opened: false });
    }

    public openMenu() {
        this.setState({ opened: true });
    }

    public _handleNativeDocClick = (event: Event) => {
        // tslint:disable-next-line
        const target = event.target || event.srcElement;
        if (target instanceof Node) {
            const node = this.link;
            if (node && !node.contains(target)) {
                this.closeMenu();
            }
        }
    };

    public refMenu(element: null | HTMLElement) {
        if (this._focusSubscribtion) {
            this._focusSubscribtion.remove();
            this._focusSubscribtion = null;

            document.removeEventListener("mousedown", this._handleNativeDocClick);
        }

        if (element != null) {
            const node = this.link;
            if (node && node instanceof HTMLElement) {
                this._focusSubscribtion = listenFocusOutside([node], () => this.closeMenu());
            }
            document.addEventListener("mousedown", this._handleNativeDocClick);
        }
    }

    public adjustRenderTitle(renderTitleValue: string | (() => any)): () => any {
        return typeof renderTitleValue === "string" ? () => renderTitleValue : renderTitleValue;
    }

    public renderMenu(items: any): JSX.Element {
        return (
            <div
                data-tid="LinkDropdownContent"
                ref={element => this.refMenu(element)}
                className={cn("menu-container")}
                onClick={() => this.closeMenu()}>
                <div className={cn("menu")}>{items}</div>
            </div>
        );
    }

    public render(): JSX.Element {
        const { iconName, children, renderTitle, disabled } = this.props;
        const renderTitleFunc = this.adjustRenderTitle(renderTitle);

        return (
            <div
                ref={el => (this.link = el)}
                className={cn("root", {
                    opened: this.state.opened,
                    closed: !this.state.opened,
                    disabled: disabled,
                })}>
                <div className={cn("title-container")} onClick={() => this.toggleMenu()}>
                    <div className={cn("title")}>
                        {iconName} <span className={cn("text")}>{renderTitleFunc()}</span>
                        <ArrowTriangleDownIcon />
                    </div>
                    <div className={cn("title-shadow")} />
                </div>
                {this.state.opened && this.renderMenu(children)}
            </div>
        );
    }
}
