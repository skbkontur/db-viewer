import React from "react";

import { ApiErrorInfo } from "../../Domain/ApiBase/ApiError";

import { ErrorHandlingContainerModal } from "./ErrorHandlingContainerModal";

interface ErrorHandlingContainerState {
    isFatal: boolean;
    error: Error | null;
    stack: string | null;
    showModal: boolean;
}

export class ErrorHandlingContainer extends React.Component<{}, ErrorHandlingContainerState> {
    public state: ErrorHandlingContainerState = {
        isFatal: false,
        error: null,
        stack: null,
        showModal: false,
    };

    public oldOnunhandledrejection: null | ((e: PromiseRejectionEvent, ...rest: any[]) => void) = null;

    public componentDidMount(): void {
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

    public componentWillUnmount(): void {
        window.onunhandledrejection = this.oldOnunhandledrejection;
    }

    public render(): JSX.Element {
        const { isFatal, showModal, stack, error } = this.state;
        const { message, serverErrorType, serverStackTrace } = (error || {}) as ApiErrorInfo;
        return (
            <div>
                {showModal && (
                    <ErrorHandlingContainerModal
                        canClose={!isFatal}
                        onClose={() => this.setState({ showModal: false })}
                        message={serverErrorType + ": " + message}
                        stack={stack}
                        serverStack={serverStackTrace}
                    />
                )}
            </div>
        );
    }
}
