import * as React from "react";

import cn from "./SideMenu.less";

export interface SideMenuProps {
    children: React.ReactNode;
}

interface SideMenuMenuProps {
    children: React.ReactNode;
}

interface SideMenuContentProps {
    children: React.ReactNode;
    style?: { [key: string]: string | number };
}

export class SideMenu extends React.Component<SideMenuProps> {
    public static Menu = function Menu({ children }: SideMenuMenuProps): JSX.Element {
        return <div className={cn("menu")}>{children}</div>;
    };

    public static Content = function Content({ children, style }: SideMenuContentProps): JSX.Element {
        return (
            <div className={cn("content")} style={style}>
                {children}
            </div>
        );
    };

    public render(): JSX.Element {
        return (
            <div className={cn("root-wrapper")}>
                <div className={cn("root")}>{this.props.children}</div>
            </div>
        );
    }
}
