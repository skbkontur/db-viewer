import { ArrowALeftIcon24Regular } from "@skbkontur/icons/ArrowALeftIcon24Regular";
import { Loader, ThemeContext } from "@skbkontur/react-ui";
import React, { CSSProperties } from "react";

import { RouterLink } from "../RouterLink/RouterLink";

import { jsStyles } from "./CommonLayout.styles";

interface CommonLayoutProps {
    topRightTools?: Nullable<React.ReactElement> | string;
    children?: React.ReactNode;
    withArrow?: boolean;
    style?: CSSProperties;
}

export function CommonLayout({
    children,
    topRightTools,
    withArrow,
    ...restProps
}: CommonLayoutProps): React.ReactElement {
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

CommonLayout.Content = function Content({ children, ...restProps }: CommonLayoutContentProps): React.ReactElement {
    return (
        <div className={jsStyles.content()} {...restProps}>
            {children}
        </div>
    );
};

interface CommonLayoutHeaderProps {
    title: string | React.ReactElement;
    tools?: React.ReactElement;
    children?: React.ReactElement;
    borderBottom?: boolean;
}

CommonLayout.Header = function Header({
    title,
    tools,
    children,
    borderBottom,
}: CommonLayoutHeaderProps): React.ReactElement {
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

CommonLayout.GoBack = function CommonLayoutGoBack({ to }: CommonLayoutGoBackProps): React.ReactElement {
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

CommonLayout.ContentLoader = function ContentLoader(props: ContentLoaderProps): React.ReactElement {
    const { active, children, ...restProps } = props;

    return (
        <Loader className={jsStyles.loader()} active={active} type="big" {...restProps}>
            {children}
        </Loader>
    );
};
