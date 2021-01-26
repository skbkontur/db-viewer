import ArrowChevronLeftIcon from "@skbkontur/react-icons/ArrowChevronLeft";
import { Fill, Fit, RowStack } from "@skbkontur/react-stack-layout";
import { Loader } from "@skbkontur/react-ui";
import React from "react";
import { Link } from "react-router-dom";

import styles from "./CommonLayout.less";

interface CommonLayoutProps {
    topRightTools?: Nullable<JSX.Element> | string;
    children?: any;
    style?: any;
}

interface CommonLayoutContentProps {
    children?: any;
    className?: void | string;
}

interface CommonLayoutHeaderProps {
    title: string | JSX.Element;
    tools?: JSX.Element;
}

interface CommonLayoutGreyLineHeaderProps {
    "data-tid"?: Nullable<string>;
    children?: Nullable<JSX.Element>;
    title: string | JSX.Element;
    tools?: null | JSX.Element;
}

interface CommonLayoutGoBackProps {
    children?: any;
    to: string;
}

interface ContentLoaderProps {
    children?: React.ReactNode;
    active: boolean;
    type?: "big";
    caption?: string;
}

export class CommonLayout extends React.Component<CommonLayoutProps> {
    public static Content = function Content({ children, ...restProps }: CommonLayoutContentProps): JSX.Element {
        return (
            <div className={styles.content} {...restProps}>
                {children}
            </div>
        );
    };

    public static Header = function Header({ title, tools, ...restProps }: CommonLayoutHeaderProps): JSX.Element {
        return (
            <div className={styles.header} {...restProps}>
                <RowStack baseline block gap={2}>
                    <Fit>
                        <h2 className={styles.headerTitle} data-tid="Header">
                            {title}
                        </h2>
                    </Fit>
                    {tools && <Fill>{tools}</Fill>}
                </RowStack>
            </div>
        );
    };

    public static GreyLineHeader = function GreyLineHeader({
        children,
        title,
        tools,
    }: CommonLayoutGreyLineHeaderProps): JSX.Element {
        return (
            <div className={styles.greyLineHeader}>
                <RowStack baseline block gap={2}>
                    <Fill>
                        <h2 className={styles.headerTitle} data-tid="Header">
                            {title}
                        </h2>
                    </Fill>
                    {tools && <Fit>{tools}</Fit>}
                </RowStack>
                {children && <div className={styles.content}>{children}</div>}
            </div>
        );
    };

    public static GoBack = function CommonLayoutGoBack({ children, to }: CommonLayoutGoBackProps): JSX.Element {
        return (
            <div className={styles.backLinkContainer}>
                <Link className={styles.routerLink} data-tid="GoBack" to={to}>
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
            <Loader className={styles.loader} active={active} type="big" {...restProps}>
                {children}
            </Loader>
        );
    };

    public render(): JSX.Element {
        const { children, topRightTools, ...restProps } = this.props;
        return (
            <div className={styles.commonLayout} {...restProps}>
                {topRightTools && <div className={styles.topRightTools}>{topRightTools}</div>}
                {children}
            </div>
        );
    }
}
