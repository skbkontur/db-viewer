import React from "react";

import { ApiError } from "Domain/ApiBase/ApiError";

export interface ErrorHandlingContainerProps {
    children?: any;
    handlers: Array<(state: ErrorModalProps) => React.ReactElement | null>;
}

export interface ErrorModalProps {
    isFatal: boolean;
    error: Error | null;
    stack: string | null;
    onClose: () => void;
}

interface ErrorHandlingContainerState {
    isFatal: boolean;
    error: Error | null;
    stack: string | null;
    showModal: boolean;
}

export function apiErrorHandler(
    component: (state: ErrorModalProps) => React.ReactElement,
    statusCode: Nullable<number>
): (state: ErrorModalProps) => React.ReactElement | null {
    return (state: ErrorModalProps) => {
        if (statusCode == null) {
            return component(state);
        }
        if (state.error instanceof ApiError && state.error.statusCode === statusCode) {
            return component(state);
        }
        return null;
    };
}

export class GenericErrorHandlingContainer extends React.Component<
    ErrorHandlingContainerProps,
    ErrorHandlingContainerState
> {
    public state: ErrorHandlingContainerState = {
        isFatal: false,
        error: null,
        stack: null,
        showModal: false,
    };

    public oldOnunhandledrejection: null | ((e: PromiseRejectionEvent, ...rest: any[]) => void) = null;

    public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        this.setState({
            showModal: true,
            isFatal: true,
            error: error,
            stack: errorInfo.componentStack,
        });
    }

    public componentDidMount() {
        this.oldOnunhandledrejection = window.onunhandledrejection;
        window.onunhandledrejection = (e: any, ...restArgs: any[]) => {
            if (this.oldOnunhandledrejection) {
                this.oldOnunhandledrejection(e, ...restArgs);
            }
            if (typeof e.preventDefault === "function") {
                e.preventDefault();
            }
            this.setState({
                showModal: true,
                isFatal: false,
                error: e.reason,
                stack: e.reason.stack,
            });
        };
    }

    public componentWillUnmount() {
        window.onunhandledrejection = this.oldOnunhandledrejection;
    }

    public render(): JSX.Element {
        const { children } = this.props;
        const { isFatal, showModal } = this.state;

        return (
            <div>
                {showModal && this.renderErrorModal()}
                {!isFatal && children}
            </div>
        );
    }

    private renderErrorModal(): React.ReactElement | null {
        const { handlers } = this.props;
        for (const handler of handlers) {
            const component = handler({
                error: this.state.error,
                isFatal: this.state.isFatal,
                stack: this.state.stack,
                onClose: () => this.setState({ showModal: false }),
            });
            if (component != null) {
                return component;
            }
        }
        return null;
    }
}
