import { IconArrowALeftRegular24 } from "@skbkontur/icons/IconArrowALeftRegular24";
import { Loader, ThemeContext } from "@skbkontur/react-ui";
import { type CSSProperties, type ReactElement, type ReactNode, useContext } from "react";

import { RouterLink } from "../RouterLink/RouterLink";

import { jsStyles } from "./CommonLayout.styles";

interface CommonLayoutProps {
    topRightTools?: Nullable<ReactElement> | string;
    children?: ReactNode;
    withArrow?: boolean;
    style?: CSSProperties;
}

export function CommonLayout({ children, topRightTools, withArrow, ...restProps }: CommonLayoutProps): ReactElement {
    const theme = useContext(ThemeContext);
    return (
        <div className={`${jsStyles.commonLayout(theme)} ${withArrow ? jsStyles.withArrow() : ""}`} {...restProps}>
            {topRightTools && <div className={jsStyles.topRightTools()}>{topRightTools}</div>}
            {children}
        </div>
    );
}

interface CommonLayoutContentProps {
    children?: ReactNode;
    className?: void | string;
}

CommonLayout.Content = function Content({ children, ...restProps }: CommonLayoutContentProps): ReactElement {
    return (
        <div className={jsStyles.content()} {...restProps}>
            {children}
        </div>
    );
};

interface CommonLayoutHeaderProps {
    title: string | ReactElement;
    tools?: ReactElement;
    children?: ReactElement;
    borderBottom?: boolean;
}

CommonLayout.Header = function Header({ title, tools, children, borderBottom }: CommonLayoutHeaderProps): ReactElement {
    const theme = useContext(ThemeContext);
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

CommonLayout.GoBack = function CommonLayoutGoBack({ to }: CommonLayoutGoBackProps): ReactElement {
    const theme = useContext(ThemeContext);
    return (
        <RouterLink data-tid="GoBack" to={to} className={jsStyles.backLink()}>
            <IconArrowALeftRegular24 align="none" className={jsStyles.backLinkIcon(theme)} />
        </RouterLink>
    );
};

interface ContentLoaderProps {
    children?: ReactNode;
    active: boolean;
    type?: "big";
    caption?: string;
}

CommonLayout.ContentLoader = function ContentLoader(props: ContentLoaderProps): ReactElement {
    const { active, children, ...restProps } = props;

    return (
        <Loader className={jsStyles.loader()} active={active} type="big" {...restProps}>
            {children}
        </Loader>
    );
};
