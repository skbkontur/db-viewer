import { ArrowALeftIcon24Regular } from "@skbkontur/icons/ArrowALeftIcon24Regular";
import { Loader, ThemeContext } from "@skbkontur/react-ui";
import React, { CSSProperties } from "react";

import { RouterLink } from "../RouterLink/RouterLink";

import { jsStyles } from "./CommonLayout.styles";

interface CommonLayoutProps {
    topRightTools?: Nullable<JSX.Element> | string;
    children?: React.ReactNode;
    withArrow?: boolean;
    style?: CSSProperties;
}

export function CommonLayout({ children, topRightTools, withArrow, ...restProps }: CommonLayoutProps): JSX.Element {
    const theme = React.useContext(ThemeContext);
    return (
        <div className={`${jsStyles.commonLayout(theme)} ${withArrow ? jsStyles.withArrow() : ""}`} {...restProps}>
            {topRightTools && <div className={jsStyles.topRightTools()}>{topRightTools}</div>}
            {children}
        </div>
    );
}

interface CommonLayoutContentProps {
    children?: React.ReactNode;
    className?: void | string;
}

CommonLayout.Content = function Content({ children, ...restProps }: CommonLayoutContentProps): JSX.Element {
    return (
        <div className={jsStyles.content()} {...restProps}>
            {children}
        </div>
    );
};

interface CommonLayoutHeaderProps {
    title: string | JSX.Element;
    tools?: JSX.Element;
    children?: JSX.Element;
    borderBottom?: boolean;
}

CommonLayout.Header = function Header({ title, tools, children, borderBottom }: CommonLayoutHeaderProps): JSX.Element {
    const theme = React.useContext(ThemeContext);
    return (
        <div className={`${jsStyles.headerWrapper()} ${borderBottom ? jsStyles.borderBottom(theme) : ""}`}>
            <div className={jsStyles.header()}>
                <h2 className={jsStyles.headerTitle()} data-tid="Header">
                    {title}
                </h2>
                {tools}
            </div>
            {children && <div className={`${jsStyles.content()} ${jsStyles.headerContent()}`}>{children}</div>}
        </div>
    );
};

interface CommonLayoutGoBackProps {
    to: string;
}

CommonLayout.GoBack = function CommonLayoutGoBack({ to }: CommonLayoutGoBackProps): JSX.Element {
    const theme = React.useContext(ThemeContext);
    return (
        <RouterLink data-tid="GoBack" to={to} className={jsStyles.backLink()}>
            <ArrowALeftIcon24Regular align="none" className={jsStyles.backLinkIcon(theme)} />
        </RouterLink>
    );
};

interface ContentLoaderProps {
    children?: React.ReactNode;
    active: boolean;
    type?: "big";
    caption?: string;
}

CommonLayout.ContentLoader = function ContentLoader(props: ContentLoaderProps): JSX.Element {
    const { active, children, ...restProps } = props;

    return (
        <Loader className={jsStyles.loader()} active={active} type="big" {...restProps}>
            {children}
        </Loader>
    );
};
