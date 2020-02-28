import Modal from "@skbkontur/react-ui/Modal";
import * as React from "react";

import cn from "./RetailUIModalForTesting.less";

interface RetailUIModalForTestingProps {
    ignoreBackgroundClick: boolean;
    noClose: boolean;
    width?: number;
    onClose?: () => any;
    children?: any;
}

class RetailUIModalForTesting extends React.Component<RetailUIModalForTestingProps> {
    public static defaultProps = {
        ignoreBackgroundClick: false,
        noClose: false,
    };

    public static Header: any;
    public static Footer: any;
    public static Body: any;

    public render(): JSX.Element {
        const { children, ...restProps } = this.props;
        return <Modal {...restProps}>{children}</Modal>;
    }
}

interface RetailUIModalHeaderProps {
    children?: any;
}

class ModalHeaderForTestingMode extends React.Component<RetailUIModalHeaderProps> {
    public render(): JSX.Element {
        const { children } = this.props;
        return <div className={cn("header")}>{typeof children === "function" ? children() : children}</div>;
    }
}

interface RetailUIModalFooterProps {
    panel: boolean;
    children?: any;
}

class ModalFooterForTestingMode extends React.Component<RetailUIModalFooterProps> {
    public static defaultProps = { panel: false };

    public render(): JSX.Element {
        const { children } = this.props;
        return (
            <div className={cn("footer", { panel: this.props.panel })}>
                {typeof children === "function" ? children() : children}
            </div>
        );
    }
}

RetailUIModalForTesting.Header = ModalHeaderForTestingMode;
RetailUIModalForTesting.Body = Modal.Body;
RetailUIModalForTesting.Footer = ModalFooterForTestingMode;

export { RetailUIModalForTesting };
