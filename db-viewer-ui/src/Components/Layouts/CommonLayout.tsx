import ArrowChevronLeftIcon from "@skbkontur/react-icons/ArrowChevronLeft";
import { Fill, Fit, RowStack } from "@skbkontur/react-stack-layout";
import { Loader, ThemeContext } from "@skbkontur/react-ui";
import React from "react";

import { RouterLink } from "../RouterLink/RouterLink";

import { jsStyles } from "./CommonLayout.styles";

interface CommonLayoutProps {
    topRightTools?: Nullable<JSX.Element> | string;
    children?: React.ReactNode;
    style?: any;
}

export function CommonLayout({ children, topRightTools, ...restProps }: CommonLayoutProps): JSX.Element {
    const theme = React.useContext(ThemeContext);
    return (
        <div className={jsStyles.commonLayout(theme)} {...restProps}>
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
}

CommonLayout.Header = function Header({ title, tools, ...restProps }: CommonLayoutHeaderProps): JSX.Element {
    return (
        <div className={jsStyles.header()} {...restProps}>
            <RowStack baseline block gap={2}>
                <Fit>
                    <h2 className={jsStyles.headerTitle()} data-tid="Header">
                        {title}
                    </h2>
                </Fit>
                {tools && <Fill>{tools}</Fill>}
            </RowStack>
        </div>
    );
};

interface CommonLayoutGreyLineHeaderProps {
    "data-tid"?: Nullable<string>;
    children?: Nullable<JSX.Element>;
    title: string | JSX.Element;
    tools?: null | JSX.Element;
}

CommonLayout.GreyLineHeader = function GreyLineHeader({
    children,
    title,
    tools,
}: CommonLayoutGreyLineHeaderProps): JSX.Element {
    const theme = React.useContext(ThemeContext);
    return (
        <div className={jsStyles.greyLineHeader(theme)}>
            <RowStack baseline block gap={2}>
                <Fill>
                    <h2 className={jsStyles.headerTitle()} data-tid="Header">
                        {title}
                    </h2>
                </Fill>
                {tools && <Fit>{tools}</Fit>}
            </RowStack>
            {children && <div className={`${jsStyles.content()} ${jsStyles.greyContent()}`}>{children}</div>}
        </div>
    );
};

interface CommonLayoutGoBackProps {
    children?: React.ReactNode;
    to: string;
}

CommonLayout.GoBack = function CommonLayoutGoBack({ children, to }: CommonLayoutGoBackProps): JSX.Element {
    return (
        <div className={jsStyles.backLinkContainer()}>
            <RouterLink data-tid="GoBack" to={to}>
                <ArrowChevronLeftIcon />
                {"\u00A0"}
                {children}
            </RouterLink>
        </div>
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
