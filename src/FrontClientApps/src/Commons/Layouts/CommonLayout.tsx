import ArrowChevronLeftIcon from "@skbkontur/react-icons/ArrowChevronLeft";
import Loader from "@skbkontur/react-ui/Loader";
import Sticky from "@skbkontur/react-ui/Sticky";
import { LocationDescriptor } from "history";
import * as React from "react";
import { Fill } from "Commons/Layouts/Fill";
import { Fit } from "Commons/Layouts/Fit";
import { RowStack } from "Commons/Layouts/RowStack";
import { RouterLink } from "Commons/RouterLink/RouterLink";

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

interface FullWidthContainerProps {
    className?: Nullable<string>;
    negativePadding?: 0 | 2;
    children?: any;
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
    href?: string | null;
    to?: LocationDescriptor;
}

interface ContentTopBlockProps {
    children?: React.ReactNode;
    className?: Nullable<string>;
}

interface ContentBlockProps {
    children?: React.ReactNode;
    bottomGap?: Nullable<number>;
}

interface ContentLoaderProps {
    children?: React.ReactNode;
    active: boolean;
    type?: "big";
    caption?: string;
}

interface CommonLayoutTabbedHeaderProps {
    title: JSX.Element | string;
    tools?: JSX.Element;
    tabs: Array<{ to: LocationDescriptor; tid?: string; caption: string }>;
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

    public static FullWidthContainer = function FullWidthContainer({
        children,
        className,
        negativePadding,
        ...restProps
    }: FullWidthContainerProps): JSX.Element {
        return (
            <div
                className={cn(
                    "full-with-container",
                    "negative-padding-" + (negativePadding == null ? 0 : negativePadding),
                    className
                )}
                {...restProps}>
                {children}
            </div>
        );
    };

    public static ContentTopBlock = function ContentTopBlock({
        children,
        className,
        ...restProps
    }: ContentTopBlockProps): JSX.Element {
        return (
            <div className={cn("content-top-block", className)} {...restProps}>
                {children}
            </div>
        );
    };

    public static ContentBlock = function ContentBlock({
        children,
        bottomGap,
        ...restProps
    }: ContentBlockProps): JSX.Element {
        return (
            <div className={cn("content-block", `bottom-gap-${bottomGap || 0}`)} {...restProps}>
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

    public static GoBack = function CommonLayoutGoBack({ children, href, to }: CommonLayoutGoBackProps): JSX.Element {
        return (
            <div className={cn("back-link-container")}>
                <RouterLink data-tid="GoBack" icon={<ArrowChevronLeftIcon />} href={href} to={to}>
                    {children}
                </RouterLink>
            </div>
        );
    };

    public static TabbedHeader = function CommonLayoutTabbedHeader(props: CommonLayoutTabbedHeaderProps): JSX.Element {
        const { title, tools, tabs, ...restProps } = props;

        return (
            <RowStack className={cn("tabbed-header")} block baseline gap={10} {...restProps}>
                <Fit>
                    <h2 data-tid="Header">{title}</h2>
                </Fit>
                <Fit>
                    {tabs.map((tab, index) => (
                        <RouterLink
                            key={index}
                            data-tid={tab.tid}
                            to={tab.to}
                            className={cn("tab-link")}
                            activeClassName={cn("active")}>
                            <span>{tab.caption}</span>
                        </RouterLink>
                    ))}
                </Fit>
                {tools && <Fill className={cn("show-changes")}>{tools}</Fill>}
            </RowStack>
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
