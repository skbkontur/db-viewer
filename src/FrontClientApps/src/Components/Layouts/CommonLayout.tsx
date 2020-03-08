import ArrowChevronLeftIcon from "@skbkontur/react-icons/ArrowChevronLeft";
import { Fill, Fit, RowStack } from "@skbkontur/react-stack-layout";
import Loader from "@skbkontur/react-ui/Loader";
import Sticky from "@skbkontur/react-ui/Sticky";
import { LocationDescriptor } from "history";
import React from "react";
import { Link } from "react-router-dom";

import cn from "./CommonLayout.less";

interface CommonLayoutProps {
    topRightTools?: Nullable<JSX.Element> | string;
    children?: any;
    style?: any;
}

interface CommonLayoutContentProps {
    children?: any;
    paddingInUnits?: 0 | 3 | 5;
    className?: void | string;
}

interface CommonLayoutHeaderProps {
    title: string | JSX.Element;
    tools?: JSX.Element;
}

interface CommonLayoutFooterProps extends React.HTMLProps<HTMLDivElement> {
    children?: any;
    sticky?: boolean;
    panel?: boolean;
    whitePanel?: boolean;
}

interface CommonLayoutGreyLineHeaderProps {
    "data-tid"?: Nullable<string>;
    children?: Nullable<JSX.Element>;
    title: string | JSX.Element;
    tools?: null | JSX.Element;
}

interface CommonLayoutGoBackProps {
    children?: any;
    to: LocationDescriptor;
}

interface ContentLoaderProps {
    children?: React.ReactNode;
    active: boolean;
    type?: "big";
    caption?: string;
}

export class CommonLayout extends React.Component<CommonLayoutProps> {
    public static Content = function Content({
        children,
        paddingInUnits,
        ...restProps
    }: CommonLayoutContentProps): JSX.Element {
        return (
            <div
                className={cn("content", "padding-" + (paddingInUnits == null ? 4 : paddingInUnits).toString())}
                {...restProps}>
                {children}
            </div>
        );
    };

    public static Header = function Header({ title, tools, ...restProps }: CommonLayoutHeaderProps): JSX.Element {
        return (
            <div className={cn("header")} {...restProps}>
                <RowStack baseline block gap={2}>
                    <Fit>
                        <h2 data-tid="Header">{title}</h2>
                    </Fit>
                    {tools && <Fill>{tools}</Fill>}
                </RowStack>
            </div>
        );
    };

    public static Footer = function Footer({
        children,
        sticky,
        panel,
        ...restProps
    }: CommonLayoutFooterProps): JSX.Element {
        if (sticky) {
            return (
                <Sticky side="bottom">
                    <div className={cn("footer", { panel: panel })} {...restProps}>
                        {children}
                    </div>
                </Sticky>
            );
        }
        return (
            <div className={cn("footer", { panel: panel })} {...restProps}>
                {children}
            </div>
        );
    };

    public static GreyLineHeader = function GreyLineHeader({
        children,
        title,
        tools,
    }: CommonLayoutGreyLineHeaderProps): JSX.Element {
        return (
            <div className={cn("grey-line-header")}>
                <RowStack baseline block gap={2}>
                    <Fill>
                        <h2 data-tid="Header">{title}</h2>
                    </Fill>
                    {tools && <Fit>{tools}</Fit>}
                </RowStack>
                {children && <div className={cn("content")}>{children}</div>}
            </div>
        );
    };

    public static GoBack = function CommonLayoutGoBack({ children, to }: CommonLayoutGoBackProps): JSX.Element {
        return (
            <div className={cn("back-link-container")}>
                <Link className={cn("back-link")} data-tid="GoBack" to={to}>
                    <ArrowChevronLeftIcon />
                    {"\u00A0"}
                    {children}
                </Link>
            </div>
        );
    };

    public static ContentLoader = function ContentLoader(props: ContentLoaderProps): JSX.Element {
        const { active, children, ...restProps } = props;

        return (
            <Loader className={cn("loader")} active={active} type="big" {...restProps}>
                {children}
            </Loader>
        );
    };

    public render(): JSX.Element {
        const { children, topRightTools, ...restProps } = this.props;
        return (
            <div className={cn("common-layout")} {...restProps}>
                {topRightTools && <div className={cn("top-right-tools")}>{topRightTools}</div>}
                {children}
            </div>
        );
    }
}
