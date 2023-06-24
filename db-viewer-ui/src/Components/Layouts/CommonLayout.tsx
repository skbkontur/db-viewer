import { ArrowALeftIcon24Regular } from "@skbkontur/icons/esm/icons/ArrowALeftIcon";
import { Fill, Fit, RowStack, VerticalAlign } from "@skbkontur/react-stack-layout";
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
    verticalAlign?: VerticalAlign;
    tools?: JSX.Element;
    children?: JSX.Element;
    borderBottom?: boolean;
}

CommonLayout.Header = function Header({
    title,
    tools,
    verticalAlign,
    children,
    borderBottom,
}: CommonLayoutHeaderProps): JSX.Element {
    const theme = React.useContext(ThemeContext);
    return (
        <div className={`${jsStyles.header()} ${borderBottom ? jsStyles.borderBottom(theme) : ""}`}>
            <RowStack verticalAlign={verticalAlign ?? "baseline"} block gap={2}>
                <Fill>
                    <h2 className={jsStyles.headerTitle()} data-tid="Header">
                        {title}
                    </h2>
                </Fill>
                {tools && <Fit>{tools}</Fit>}
            </RowStack>
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
            <ArrowALeftIcon24Regular color={theme.gray} className={jsStyles.backLinkIcon()} />
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
